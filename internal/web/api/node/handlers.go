package node

import (
	"fmt"
	"net/http"

	"github.com/avakarev/go-util/httputil"
	"github.com/kataras/iris/v12"
	"github.com/rs/zerolog/log"
	"github.com/stretchr/objx"

	"github.com/awtrix-light/hub/internal/db"
	"github.com/awtrix-light/hub/internal/irisutil"
)

// ListNodesHandler handles `/nodes` http get requests
func ListNodesHandler(ctx iris.Context) {
	nodes := db.ListNodes()
	irisutil.WriteJSON(iris.Map{"nodes": nodes}, ctx)
}

// CreateNodeHandler handles `/nodes` http post requests
func CreateNodeHandler(ctx iris.Context) {
	var n db.Node
	if err := ctx.ReadJSON(&n); err != nil {
		log.Error().Err(err).Send()
		irisutil.WriteErrJSON(httputil.NewErr(http.StatusBadRequest, err.Error()), ctx)
		return
	}

	if err := db.CreateNode(&n); err != nil {
		log.Error().Err(err).Send()
		irisutil.WriteErrJSON(httputil.NewErrFrom(err), ctx)
		return
	}

	ctx.StatusCode(http.StatusCreated)
	irisutil.WriteJSON(iris.Map{"node": n}, ctx)
}

// GetNodeHandler handles `/nodes/:id` http get requests
func GetNodeHandler(ctx iris.Context) {
	id := ctx.Params().Get("id")
	n := db.FindNodeByID(id)
	if n == nil {
		irisutil.WriteErrJSON(
			httputil.NewErr(
				http.StatusNotFound,
				fmt.Sprintf("no node found with given id %s", id),
			), ctx)
		return
	}
	irisutil.WriteJSON(iris.Map{"node": n}, ctx)
}

// UpdateNodeHandler handles `/nodes/:id` http patch requests
func UpdateNodeHandler(ctx iris.Context) {
	id := ctx.Params().Get("id")
	n := db.FindNodeByID(id)
	if n == nil {
		irisutil.WriteErrJSON(
			httputil.NewErr(
				http.StatusNotFound,
				fmt.Sprintf("no node found with given id %s", id),
			), ctx)
		return
	}
	data := objx.Map{}
	if err := ctx.ReadJSON(&data); err != nil {
		log.Error().Err(err).Send()
		irisutil.WriteErrJSON(httputil.NewErr(http.StatusBadRequest, err.Error()), ctx)
		return
	}
	if err := db.UpdateNode(n, data); err != nil {
		log.Error().Err(err).Send()
		irisutil.WriteErrJSON(httputil.NewErrFrom(err), ctx)
		return
	}
	irisutil.WriteJSON(iris.Map{"node": n}, ctx)
}

// DeleteNodeHandler handles `/nodes/:id` http delete requests
func DeleteNodeHandler(ctx iris.Context) {
	id := ctx.Params().Get("id")
	if err := db.DeleteNode(id); err != nil {
		log.Error().Err(err).Send()
		irisutil.WriteErrJSON(httputil.NewErrFrom(err), ctx)
		return
	}

	ctx.StatusCode(http.StatusOK)
	irisutil.WriteJSON(iris.Map{}, ctx)
}
