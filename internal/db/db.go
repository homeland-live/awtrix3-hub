// Package db implements access to database
package db

import (
	"os"
	"reflect"
	"strings"

	"github.com/avakarev/go-util/gormutil"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/sqlite"
)

var db *gormutil.DB

// Session returns db session
func Session() *gormutil.DB {
	return db
}

// Init initializes db
func Init() error {
	dsn := "./data/hub.db"
	if fd := os.Getenv("AWTRIX3_HUB_DSN"); fd != "" {
		dsn = fd
	}
	sqlitedb, err := gormutil.Open(sqlite.Open(dsn))
	if err != nil {
		return err
	}
	db = sqlitedb

	// register function to get tag name from json tags
	db.RegisterValidationTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})

	return migrate(db.Conn())
}

// MustInit is like Init but panics in case of error
func MustInit() {
	if err := Init(); err != nil {
		log.Fatal().Err(err).Send()
	}
}
