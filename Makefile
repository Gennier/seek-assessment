

NESTCLI = npx nest
MODULE_NAME ?= 


.PHONY: all

# Generate users module, resolver, service, and other components
all: generate-module generate-controller generate-service generate-dto generate-entity

generate-module:
	$(NESTCLI) generate module modules/$(MODULE_NAME)

generate-controller:
	$(NESTCLI) generate controller modules/$(MODULE_NAME) --no-spec

generate-service:
	$(NESTCLI) generate service modules/$(MODULE_NAME) --no-spec

generate-dto:
	mkdir src/modules/$(MODULE_NAME)/dtos

generate-entity:
	mkdir src/modules/$(MODULE_NAME)/entities


start-dev:
	pnpm run start:dev

deploy-migration:
	pnpm run prisma:deploy