# awtrix3-hub

> Coordination hub for awtrix3 devices, batteries included

![Awtrix3 Hub](docs/preview.png)

## Usage

### Docker

```console
docker run -p 8080:8081 --name awtrix-hub -v $(pwd)./:/app/data --rm ghcr.io/homeland-live/awtrix3-hub
```

### Docker Compose

See [docs/docker-compose-sqlite](docs/docker-compose-sqlite/) for an example


## License

`awtrix3-hub` is licensed under MIT license. (see [LICENSE](./LICENSE))
