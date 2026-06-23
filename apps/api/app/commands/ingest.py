import typer

from app.services.external_data import configured_sources, fetch_json

app = typer.Typer(help="Datainnhenting for VM Dashboard og Predikering.")


def import_source(source_key: str, force: bool = False) -> None:
    source = next((item for item in configured_sources() if item.key == source_key), None)
    if source is None:
        raise typer.BadParameter(f"Ukjent datakilde: {source_key}")
    result = fetch_json(source, force=force)
    typer.echo(f"{source.label}: {result['status']}")
    if result.get("cache_path"):
        typer.echo(f"Raw-cache: {result['cache_path']}")
    if result.get("message"):
        typer.echo(result["message"])


@app.command()
def import_teams(force: bool = typer.Option(False, help="Ignorer fersk cache og hent på nytt.")) -> None:
    import_source("fifa_schedule", force)


@app.command()
def import_players(force: bool = typer.Option(False, help="Ignorer fersk cache og hent på nytt.")) -> None:
    import_source("api_football_live", force)


@app.command()
def import_matches(force: bool = typer.Option(False, help="Ignorer fersk cache og hent på nytt.")) -> None:
    import_source("fifa_schedule", force)


@app.command()
def import_historical_world_cup() -> None:
    typer.echo("Historisk VM-import er klargjort for Fjelstul-datasettet som lokal CSV/JSON.")


@app.command()
def import_country_indicators(force: bool = typer.Option(False, help="Ignorer fersk cache og hent på nytt.")) -> None:
    import_source("world_bank", force)


@app.command()
def import_rankings(force: bool = typer.Option(False, help="Ignorer fersk cache og hent på nytt.")) -> None:
    import_source("fifa_rankings", force)
    import_source("world_football_elo", force)


@app.command()
def import_broadcast_links() -> None:
    typer.echo("Broadcast-lenker valideres mot NRK/TV 2 allowlist i API-et.")


if __name__ == "__main__":
    app()

