package backend.repository;

import backend.model.PlayerCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerCardRepository extends JpaRepository<PlayerCard, Long> {

    List<PlayerCard> findByPositionIgnoreCase(String position);

    List<PlayerCard> findByGameEditionIgnoreCase(String gameEdition);

    List<PlayerCard> findByCardVersionIgnoreCase(String cardVersion);

    List<PlayerCard> findByPositionIgnoreCaseAndGameEditionIgnoreCase(
            String position,
            String gameEdition);
}