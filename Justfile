set shell := ['bash', '-cu']

default: dev

install:
	@echo "Установка зависимостей"
	npm install --prefix app/web

dev:
	@echo "Запуск dev-сервера (Vite)"
	npm run dev --prefix app/web

build:
	@echo "Сборка"
	npm run build --prefix app/web

preview:
	@echo "Предпросмотр"
	npm run preview --prefix app/web

lint:
	@echo "Запуск линтера"
	npm run lint --prefix app/web

test:
	@echo "Запуск тестов"
	npm test --prefix app/web

release: build
	@echo "Подготовка релизного артефакта"
	rm -rf release || true
	mkdir -p release
	cp -r app/web/dist/* release/
	zip -r release/roomassets-release.zip release/*
