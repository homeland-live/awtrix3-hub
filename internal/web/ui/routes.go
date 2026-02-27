// Package ui defines and handles /ui* routes
package ui

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
)

// Routes adds ui routes to the fiber
func Routes(app *fiber.App) {
	app.Use("/ui", static.New("ui/dist"))
	app.Get("/", func(c fiber.Ctx) error {
		return c.Redirect().To("/ui")
	})
}
