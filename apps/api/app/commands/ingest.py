import typer

app = typer.Typer(help="Data ingestion commands for World Cup Insights.")


def planned(source: str) -> None:
    typer.echo(
        f"{source}: seeded/mock implementation is active. "
        "TODO: connect provider client, cache raw responses, respect rate limits, "
        "store raw payloads, then upsert normalized records."
    )


@app.command()
def import_teams() -> None:
    planned("import_teams")


@app.command()
def import_players() -> None:
    planned("import_players")


@app.command()
def import_matches() -> None:
    planned("import_matches")


@app.command()
def import_historical_world_cup() -> None:
    planned("import_historical_world_cup")


@app.command()
def import_country_indicators() -> None:
    planned("import_country_indicators")


@app.command()
def import_rankings() -> None:
    planned("import_rankings")


@app.command()
def import_broadcast_links() -> None:
    planned("import_broadcast_links")


if __name__ == "__main__":
    app()

