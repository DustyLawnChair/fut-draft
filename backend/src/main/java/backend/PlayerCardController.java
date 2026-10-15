package backend;

import backend.model.PlayerCard;
import backend.repository.PlayerCardRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/player-cards")
@CrossOrigin(origins = "http://localhost:5173")
public class PlayerCardController {

    private final PlayerCardRepository playerCardRepository;

    public PlayerCardController(PlayerCardRepository playerCardRepository) {
        this.playerCardRepository = playerCardRepository;
    }

    @GetMapping
    public List<PlayerCard> getPlayerCards(
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String gameEdition,
            @RequestParam(required = false) String cardVersion) {

        List<PlayerCard> cards = playerCardRepository.findAll();

        if (position != null && !position.isBlank()) {
            cards = cards.stream()
                    .filter(card -> card.getPosition().equalsIgnoreCase(position))
                    .toList();
        }

        if (gameEdition != null && !gameEdition.isBlank()) {
            cards = cards.stream()
                    .filter(card -> card.getGameEdition().equalsIgnoreCase(gameEdition))
                    .toList();
        }

        if (cardVersion != null && !cardVersion.isBlank()) {
            cards = cards.stream()
                    .filter(card -> card.getCardVersion().equalsIgnoreCase(cardVersion))
                    .toList();
        }

        return cards;
    }
}