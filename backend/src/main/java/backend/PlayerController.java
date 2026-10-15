
package backend;

import backend.model.Player;
import backend.repository.PlayerRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerRepository playerRepository;

    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @GetMapping
    public List<Player> getPlayers(
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String club) {

        if (position != null && !position.isBlank()) {
            return playerRepository.findByPositionIgnoreCase(position);
        }

        if (club != null && !club.isBlank()) {
            return playerRepository.findByClubIgnoreCase(club);
        }

        return playerRepository.findAll();
    }
}
