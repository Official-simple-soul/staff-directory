push:
	@git add .
	@git commit -m "ch: update and fixes" || true
	@git push origin main
	@git push origin2 main
