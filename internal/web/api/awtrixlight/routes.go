// Package awtrixlight defines and handles /awtrix-light/* routes
package awtrixlight

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

const awtrixLightReleaseURL = "https://api.github.com/repos/Blueforcer/awtrix-light/releases/latest"

type release struct {
	Tag string `json:"tag_name"`
	URL string `json:"html_url"`
}

func reqRelease() (*release, error) {
	resp, err := http.Get(awtrixLightReleaseURL)

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("expected api response status code 200, got %d", resp.StatusCode)
	}

	var rel release
	return &rel, json.NewDecoder(resp.Body).Decode(&rel)

}

// Routes adds health api routes to the fiber
func Routes(api fiber.Router) {
	api.Get("/v1/awtrix-light/release", func(c *fiber.Ctx) error {
		rel, err := reqRelease()
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{"release": rel})
	})
}
