// Package awtrixlight defines and handles /awtrix-light/* routes
package awtrixlight

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/avakarev/go-util/httputil"
	"github.com/awtrix-light/hub/internal/irisutil"
	"github.com/kataras/iris/v12"
	"github.com/rs/zerolog/log"
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

// Routes adds health api routes to the iris app
func Routes(api iris.Party) {
	api.Get("/v1/awtrix-light/release", func(ctx iris.Context) {
		rel, err := reqRelease()
		if err != nil {
			log.Error().Err(err).Send()
			irisutil.WriteErrJSON(httputil.NewErrFrom(err), ctx)
			return
		}
		if err := ctx.JSON(iris.Map{"release": rel}); err != nil {
			log.Error().Err(err).Send()
		}
	})
}
