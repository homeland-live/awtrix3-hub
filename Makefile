GO_META_MOD := github.com/avakarev/go-util/buildmeta

LDFLAGS += -s -w
LDFLAGS += -X ${GO_META_MOD}.Commit=${GITHUB_SHA}
LDFLAGS += -X ${GO_META_MOD}.Ref=${GITHUB_REF}
LDFLAGS += -X ${GO_META_MOD}.BuildTimeUTC=$(shell date -u +"%Y-%m-%dT%H:%M:%SZ")

ifdef CGO_ENABLED
LDFLAGS += -linkmode external
LDFLAGS += -extldflags "-static"
export CGO_CFLAGS = "-D_LARGEFILE64_SOURCE" # https://github.com/mattn/go-sqlite3/issues/1164
endif

lint:
	@echo ">> Running revive..."
	@revive -config .revive.toml -formatter friendly ./...
	@echo ">> Running staticcheck..."
	@staticcheck ./...

vet:
	@echo ">> Vetting..."
	@go vet ./...

sec:
	@echo ">> Auditing..."
	@gosec -quiet -tests ./...

test:
	@echo ">> Running tests..."
	@export LOG_LEVEL=info && go test -v -race ./...
.PHONY: test

setup-ci:
	@go install github.com/mgechev/revive@latest
	@go install github.com/securego/gosec/v2/cmd/gosec@latest
	@go install honnef.co/go/tools/cmd/staticcheck@latest

ci: lint vet sec test

build:
	@echo ">> Building ./bin/server..."
	@go build -a -ldflags '${LDFLAGS}' -tags 'sqlite_json' -o ./bin/server ./cmd/server

run-server: build
	@while [ ! -f ./ui/dist/index.html ]; do sleep 0.2; done
	@./bin/server

run-ui:
	@npm run --prefix ./ui watch

dev:
	@( make run-server & make run-ui ) | cat
