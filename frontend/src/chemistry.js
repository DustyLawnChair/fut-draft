const chemistryThresholds = {
  club: [2, 4, 7],
  league: [3, 5, 8],
  nation: [2, 5, 8],
}

function isIcon(player) {
  return player?.cardVersion?.toLowerCase().includes('icon') ?? false
}

function getChemistryPoints(count, thresholds) {
  if (count >= thresholds[2]) return 3
  if (count >= thresholds[1]) return 2
  if (count >= thresholds[0]) return 1
  return 0
}

export function calculateChemistry(squad) {
  const players = Object.values(squad).filter(Boolean)
  const icons = players.filter(isIcon)

  return Object.fromEntries(
    players.map((player) => {
      const playerKey = player.cardId ?? player.id

      // Icons always have full chemistry in an eligible position.
      // Position eligibility is enforced by the draft picker.
      if (isIcon(player)) {
        return [playerKey, 3]
      }

      const counts = {
        club: 0,
        league: 0,
        nation: 0,
      }

      for (const teammate of players) {
        // Do not count the player as their own teammate.
        if (teammate === player) continue

        // Icons are handled through their dedicated bonuses below.
        if (isIcon(teammate)) continue

        if (player.club && player.club === teammate.club) {
          counts.club++
        }

        if (player.league && player.league === teammate.league) {
          counts.league++
        }

        if (player.nation && player.nation === teammate.nation) {
          counts.nation++
        }
      }

      const normalChemistry =
        getChemistryPoints(counts.club, chemistryThresholds.club) +
        getChemistryPoints(counts.league, chemistryThresholds.league) +
        getChemistryPoints(counts.nation, chemistryThresholds.nation)

      // Each Icon provides one league chemistry point to every teammate.
      const iconLeagueBonus = icons.length

      // Each Icon provides two nation points only to teammates
      // who share that Icon's nationality.
      const iconNationBonus = icons
        .filter((icon) => player.nation && icon.nation === player.nation)
        .length * 2

      const chemistry = Math.min(
        3,
        normalChemistry + iconLeagueBonus + iconNationBonus,
      )

      return [playerKey, chemistry]
    }),
  )
}
