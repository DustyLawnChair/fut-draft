
INSERT INTO player_cards (
    player_id,
    game_edition,
    card_version,
    position,
    overall,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    physical
)
SELECT
    p.id,
    'EA SPORTS FC 24',
    'Base',
    p.position,
    p.overall,
    p.pace,
    p.shooting,
    p.passing,
    p.dribbling,
    p.defending,
    p.physical
FROM players p
WHERE NOT EXISTS (
    SELECT 1
    FROM player_cards pc
    WHERE pc.player_id = p.id
      AND pc.card_version = 'Base'
);
