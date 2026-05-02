import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi";
import "@typespec/openapi3";

using Http;
using Rest;
using OpenAPI;

@service
namespace Kalenda;

// ============================================
// Models
// ============================================

@example(#{
  id: "evt-consultation",
  title: "Consultation",
  description: "30-minute consultation call",
  duration: 30
})
model EventType {
  id: string;
  title: string;
  description: string;
  duration: int32;
}

@example(#{
  id: "evt-workshop",
  title: "Workshop",
  description: "2-hour hands-on workshop",
  duration: 15
})
model CreateEventType {
  id: string;
  title: string;
  description: string;
  duration: int32;
}

@example(#{
  title: "Extended Consultation",
  description: "60-minute extended consultation",
  duration: 30
})
model UpdateEventType {
  title?: string;
  description?: string;
  duration?: int32;
}

model Booking {
  id: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  startAt: utcDateTime;
  endAt: utcDateTime;
  createdAt: utcDateTime;
}

model CreateBooking {
  eventTypeId: string;
  startAt: utcDateTime;
  guestName: string;
  guestEmail: string;
}

model Slot {
  startAt: utcDateTime;
  endAt: utcDateTime;
  isAvailable: boolean;
}

// ============================================
// Admin Operations
// ============================================

@route("/admin")
namespace Admin {

  @route("/event-types")
  namespace EventTypes {

    @get op list(): EventType[];

    @post op create(@body body: CreateEventType): EventType;

    @route("/{id}")
    @put op update(@path id: string, @body body: UpdateEventType): EventType | NotFoundResponse;

    @route("/{id}")
    @delete op delete(@path id: string): NoContentResponse | NotFoundResponse;
  }

  @route("/bookings")
  namespace Bookings {

    @get op list(): Booking[];

    @route("/{id}")
    @get op get(@path id: string): Booking | NotFoundResponse;
  }
}

// ============================================
// Public Operations
// ============================================

@route("/public")
namespace Public {

  @route("/event-types")
  namespace EventTypes {

    @get op list(): EventType[];
  }

  @route("/event-types/{id}/slots")
  namespace Slots {

    @get op list(@path id: string): Slot[];
  }

  @route("/bookings")
  namespace Bookings {

    @post op create(@body body: CreateBooking): Booking | ConflictResponse;

    @route("/{id}")
    @get op get(@path id: string): Booking | NotFoundResponse;
  }
}
