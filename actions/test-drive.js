"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

// Helper function to serialize car data
const setializedCarData = (car) => {
  return {
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    mileage: car.mileage,
    price: car.price,
    transmission: car.transmission,
    bodyType: car.bodyType,
    fuelType: car.fuelType,
    engine: car.engine,
    images: car.images,
    description: car.description,
    status: car.status,
    createdAt: car.createdAt.toISOString(),
    updatedAt: car.updatedAt.toISOString(),
  }
}

export async function bookTestDrive({
  carId,
  bookingDate,
  startTime,
  endTime,
  notes,
}) {
  try {
    // Authenticate user
    const { userId } = await auth()
    if (!userId) {
      return {
        success: false,
        error: "You must be logged in to book a test drive",
      }
    }

    // Find user in our database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return {
        success: false,
        error: "User not found in database",
      }
    }

    // Check if car exists and is available
    const car = await db.car.findUnique({
      where: { id: carId, status: "AVAILABLE" },
    })

    if (!car) {
      return {
        success: false,
        error: "Car not available for test drive",
      }
    }

    // Check if slot is already booked
    const existingBooking = await db.testDriveBooking.findFirst({
      where: {
        carId,
        bookingDate: new Date(bookingDate),
        startTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    })

    if (existingBooking) {
      return {
        success: false,
        error: "This time slot is already booked. Please select another time.",
      }
    }

    // Create the booking
    const booking = await db.testDriveBooking.create({
      data: {
        carId,
        userId: user.id,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime,
        notes: notes || null,
        status: "PENDING",
      },
      include: {
        car: true, // Include related car info
      },
    })
    

    // Revalidate relevant paths
    revalidatePath(`/test-drive/${carId}`)
    revalidatePath(`/cars/${carId}`)

    // IMPORTANT: Return the booking data with success flag
    return {
      success: true,
      data: booking,
    }
  } catch (error) {
    console.error("Error booking test drive:", error)
    return {
      success: false,
      error: error.message || "Failed to book test drive",
    }
  }
}

/**
 * Get user's test drive bookings - reservations page
 */
export async function getUserTestDrives() {
  try {
      const { userId } = await auth();
      if (!userId) {
          return {
              success: false,
              error: "Unauthorized",
          };
      }

      // Get the user from our database
      const user = await db.user.findUnique({
          where: { clerkUserId: userId },
      });

      if (!user) {
          return {
              success: false,
              error: "User not found",
          };
      }

      // Get user's test drive bookings
      const bookings = await db.testDriveBooking.findMany({
          where: { userId: user.id },
          include: {
              car: true,
          },
          orderBy: { bookingDate: "desc" },
      });

      // Format the bookings with null checks
      const formattedBookings = bookings.map((booking) => ({
          id: booking.id,
          carId: booking.carId,
          car: setializedCarData(booking.car),
          bookingDate: booking.bookingDate?.toISOString() || null,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          notes: booking.notes,
          createdAt: booking.createdAt?.toISOString() || null,
          updatedAt: booking.updatedAt?.toISOString() || null,
      }));

      return {
          success: true,
          data: formattedBookings,
      };
  } catch (error) {
      console.error("Error fetching test drives:", error);
      return {
          success: false,
          error: error.message,
      };
  }
}

/**
 * Cancel a test drive booking
 */
export async function cancelTestDrive(bookingId) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      }
    }

    // Get the user from our database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Get the booking
    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return {
        success: false,
        error: "Booking not found",
      }
    }

    // Check if user owns this booking
    if (booking.userId !== user.id && user.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized to cancel this booking",
      }
    }

    // Check if booking can be cancelled
    if (booking.status === "CANCELLED") {
      return {
        success: false,
        error: "Booking is already cancelled",
      }
    }

    if (booking.status === "COMPLETED") {
      return {
        success: false,
        error: "Cannot cancel a completed booking",
      }
    }

    // Update the booking status
    await db.testDriveBooking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    })

    // Revalidate paths
    revalidatePath("/reservations")
    revalidatePath("/admin/test-drives")

    return {
      success: true,
      message: "Test drive cancelled successfully",
    }
  } catch (error) {
    console.error("Error cancelling test drive:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}
