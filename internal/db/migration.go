package db

import (
	"github.com/avakarev/go-util/gormutil"
	"github.com/go-gormigrate/gormigrate/v2"
	"gorm.io/gorm"
)

func migrate(db *gorm.DB) error {
	return gormigrate.New(db, gormigrate.DefaultOptions, []*gormigrate.Migration{{
		ID: "202310071627", // create `nodes` table
		Migrate: func(tx *gorm.DB) error {
			type nodes struct {
				gormutil.ModelBase
				Name string `gorm:"uniqueIndex"`
				IPV4 string `gorm:"uniqueIndex"`
			}
			return tx.Migrator().CreateTable(&nodes{})
		},
		Rollback: func(tx *gorm.DB) error {
			return tx.Migrator().DropTable("nodes")
		},
	}}).Migrate()
}
