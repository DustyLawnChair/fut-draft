
package backend;

import backend.model.PlayerCard;
import backend.repository.PlayerCardRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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

        List<PlayerCard> allCards = playerCardRepository.findAll();

        Set<Long> iconPlayerIds = allCards.stream()
                .filter(card -> "Icon".equalsIgnoreCase(card.getCardVersion()))
                .filter(card -> card.getPlayer() != null)
                .map(card -> card.getPlayer().getId())
                .collect(Collectors.toSet());

        List<PlayerCard> cards = allCards.stream()
                .filter(card -> card.getPlayer() != null)
                .filter(card -> "Icon".equalsIgnoreCase(card.getCardVersion())
                        || !iconPlayerIds.contains(card.getPlayer().getId()))
                .toList();

        if (position != null && !position.isBlank()) {
            cards = cards.stream()
                    .filter(card -> card.getPosition() != null
                            && card.getPosition().equalsIgnoreCase(position))
                    .toList();
        }

        if (gameEdition != null && !gameEdition.isBlank()) {
            cards = cards.stream()
                    .filter(card -> card.getGameEdition() != null
                            && card.getGameEdition().equalsIgnoreCase(gameEdition))
                    .toList();
        }

        if (cardVersion != null && !cardVersion.isBlank()) {
            cards = cards.stream()
                    .filter(card -> card.getCardVersion() != null
                            && card.getCardVersion().equalsIgnoreCase(cardVersion))
                    .toList();
        }

        return cards;
    }
}
