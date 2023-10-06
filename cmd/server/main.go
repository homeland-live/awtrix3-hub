// Command server starts server and handles http traffic
package main

import (
	"github.com/avakarev/go-util/buildmeta"
	"github.com/avakarev/go-util/zerologutil"
	"github.com/rs/zerolog/log"

	"github.com/awtrix-light/hub/internal/web"
)

func main() {
	zerologutil.MustInit()
	log.Info().Fields(buildmeta.Fields()).Msg("build meta")
	web.MustInit()

	if err := web.Serve(); err != nil {
		log.Fatal().Err(err).Send()
	}
}
