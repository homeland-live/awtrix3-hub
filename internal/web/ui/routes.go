// Package ui defines and handles /ui* routes
package ui

import (
	"github.com/gofiber/fiber/v2"
)

// Routes adds ui routes to the fiber
func Routes(app *fiber.App) {
	app.Static("/ui", "ui/dist")
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Redirect("/ui", fiber.StatusTemporaryRedirect)
	})
}
