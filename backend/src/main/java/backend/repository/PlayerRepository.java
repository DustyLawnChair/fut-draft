
package backend.repository;

import backend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {

    List<Player> findByPositionIgnoreCase(String position);

    List<Player> findByClubIgnoreCase(String club);
}
