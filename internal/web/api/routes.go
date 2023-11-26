// Package api defines and handles /api* routes
package api

import (
	"github.com/gofiber/fiber/v2"

	"github.com/homeland-live/awtrix-light-hub/internal/web/api/awtrixlight"
	"github.com/homeland-live/awtrix-light-hub/internal/web/api/health"
	"github.com/homeland-live/awtrix-light-hub/internal/web/api/node"
	"github.com/homeland-live/awtrix-light-hub/internal/web/api/status"
)

// Routes adds api routes to the fiber
func Routes(app *fiber.App) {
	api := app.Group("/api")

	health.Routes(api)
	status.Routes(api)
	node.Routes(api)
	awtrixlight.Routes(api)
}
