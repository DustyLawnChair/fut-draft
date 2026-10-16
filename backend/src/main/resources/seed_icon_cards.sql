BEGIN;

-- Make Henry's base position a striker.
UPDATE players
SET position = 'ST'
WHERE name = 'Thierry Henry';

UPDATE player_cards pc
SET position = 'ST'
FROM players p
WHERE pc.player_id = p.id
  AND p.name = 'Thierry Henry'
  AND pc.card_version = 'Base';

-- Add a Zidane Icon card if one does not already exist.
INSERT INTO player_cards (
    player_id, game_edition, card_version, position, overall,
    pace, shooting, passing, dribbling, defending, physical
)
SELECT
    p.id, 'EA SPORTS FC 24', 'Icon', 'CAM', 94,
    82, 90, 93, 92, 72, 83
FROM players p
WHERE p.name = 'Zinedine Zidane'
  AND NOT EXISTS (
      SELECT 1 FROM player_cards pc
      WHERE pc.player_id = p.id
        AND pc.card_version = 'Icon'
  );

-- Add a Henry Icon card if one does not already exist.
INSERT INTO player_cards (
    player_id, game_edition, card_version, position, overall,
    pace, shooting, passing, dribbling, defending, physical
)
SELECT
    p.id, 'EA SPORTS FC 24', 'Icon', 'ST', 90,
    91, 90, 80, 90, 42, 78
FROM players p
WHERE p.name = 'Thierry Henry'
  AND NOT EXISTS (
      SELECT 1 FROM player_cards pc
      WHERE pc.player_id = p.id
        AND pc.card_version = 'Icon'
  );

COMMIT;
