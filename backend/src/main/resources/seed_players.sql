
INSERT INTO players (
    name, nation, club, league, position, overall,
    pace, shooting, passing, dribbling, defending, physical
)
SELECT
    seed.name, seed.nation, seed.club, seed.league,
    seed.position, seed.overall,
    seed.pace, seed.shooting, seed.passing,
    seed.dribbling, seed.defending, seed.physical
FROM (
    VALUES
    ('Harry Kane', 'England', 'Bayern Munich', 'Bundesliga', 'ST', 90, 68, 93, 84, 83, 49, 83),
    ('Robert Lewandowski', 'Poland', 'Barcelona', 'LaLiga', 'ST', 90, 75, 91, 79, 86, 44, 84),
    ('Vinicius Junior', 'Brazil', 'Real Madrid', 'LaLiga', 'LW', 91, 95, 84, 81, 91, 29, 68),
    ('Neymar Jr', 'Brazil', 'Al Hilal', 'Saudi Pro League', 'LW', 89, 86, 83, 85, 94, 37, 61),
    ('Son Heung-min', 'South Korea', 'Tottenham Hotspur', 'Premier League', 'LW', 88, 88, 89, 82, 87, 42, 65),
    ('Rafael Leao', 'Portugal', 'AC Milan', 'Serie A', 'LW', 88, 95, 83, 76, 90, 27, 74),
    ('Mohamed Salah', 'Egypt', 'Liverpool', 'Premier League', 'RW', 90, 89, 87, 82, 90, 45, 75),
    ('Lionel Messi', 'Argentina', 'Inter Miami', 'MLS', 'RW', 90, 80, 87, 90, 96, 33, 64),
    ('Bukayo Saka', 'England', 'Arsenal', 'Premier League', 'RW', 87, 85, 83, 80, 88, 64, 72),
    ('Ousmane Dembele', 'France', 'Paris Saint-Germain', 'Ligue 1', 'RW', 86, 92, 77, 81, 90, 36, 58),
    ('Jude Bellingham', 'England', 'Real Madrid', 'LaLiga', 'CM', 90, 80, 87, 83, 88, 78, 83),
    ('Luka Modric', 'Croatia', 'Real Madrid', 'LaLiga', 'CM', 88, 73, 76, 89, 90, 72, 66),
    ('Federico Valverde', 'Uruguay', 'Real Madrid', 'LaLiga', 'CM', 88, 88, 80, 84, 85, 82, 82),
    ('Rodri', 'Spain', 'Manchester City', 'Premier League', 'CDM', 91, 66, 80, 86, 84, 87, 85),
    ('Theo Hernandez', 'France', 'AC Milan', 'Serie A', 'LB', 87, 95, 72, 78, 84, 77, 84),
    ('Andrew Robertson', 'Scotland', 'Liverpool', 'Premier League', 'LB', 86, 83, 65, 82, 82, 80, 77),
    ('Alphonso Davies', 'Canada', 'Bayern Munich', 'Bundesliga', 'LB', 86, 96, 65, 77, 86, 76, 77),
    ('Ruben Dias', 'Portugal', 'Manchester City', 'Premier League', 'CB', 89, 62, 39, 66, 68, 90, 87),
    ('William Saliba', 'France', 'Arsenal', 'Premier League', 'CB', 87, 78, 40, 66, 70, 87, 83),
    ('Eder Militao', 'Brazil', 'Real Madrid', 'LaLiga', 'CB', 86, 85, 50, 68, 70, 85, 82),
    ('Achraf Hakimi', 'Morocco', 'Paris Saint-Germain', 'Ligue 1', 'RB', 88, 92, 78, 80, 83, 76, 78),
    ('Trent Alexander-Arnold', 'England', 'Liverpool', 'Premier League', 'RB', 86, 76, 69, 90, 80, 73, 70),
    ('Kyle Walker', 'England', 'Manchester City', 'Premier League', 'RB', 84, 90, 63, 77, 75, 80, 80),
    ('Thibaut Courtois', 'Belgium', 'Real Madrid', 'LaLiga', 'GK', 90, 85, 89, 76, 90, 46, 90),
    ('Alisson', 'Brazil', 'Liverpool', 'Premier League', 'GK', 89, 86, 88, 85, 90, 56, 91),
    ('Gianluigi Donnarumma', 'Italy', 'Paris Saint-Germain', 'Ligue 1', 'GK', 89, 90, 82, 79, 89, 52, 85)
) AS seed(
    name, nation, club, league, position, overall,
    pace, shooting, passing, dribbling, defending, physical
)
WHERE NOT EXISTS (
    SELECT 1 FROM players existing WHERE existing.name = seed.name
);
