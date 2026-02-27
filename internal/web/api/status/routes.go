// Package status defines and handles /status/* routes
package status

import (
	"github.com/avakarev/go-util/buildmeta"
	"github.com/gofiber/fiber/v2"
)

// Routes adds event api routes to the fiber
func Routes(api fiber.Router) {
	api.Get("/v1/status/buildinfo", func(c *fiber.Ctx) error {
		return c.JSON(buildmeta.New())
	})
}
