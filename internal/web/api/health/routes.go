// Package health defines and handles /health route
package health

import (
	"github.com/gofiber/fiber/v2"
)

// Routes adds health api routes to the fiber
func Routes(api fiber.Router) {
	api.Get("/v1/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"healthy": true})
	})
}
