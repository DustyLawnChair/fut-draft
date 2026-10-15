
package backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String nation;

    @Column(nullable = false)
    private String club;

    @Column(nullable = false)
    private String league;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private Integer overall;

    private Integer pace;
    private Integer shooting;
    private Integer passing;
    private Integer dribbling;
    private Integer defending;
    private Integer physical;

    public Player() {
    }

    public Player(
            String name, String nation, String club, String league,
            String position, Integer overall, Integer pace,
            Integer shooting, Integer passing, Integer dribbling,
            Integer defending, Integer physical) {
        this.name = name;
        this.nation = nation;
        this.club = club;
        this.league = league;
        this.position = position;
        this.overall = overall;
        this.pace = pace;
        this.shooting = shooting;
        this.passing = passing;
        this.dribbling = dribbling;
        this.defending = defending;
        this.physical = physical;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getNation() {
        return nation;
    }

    public String getClub() {
        return club;
    }

    public String getLeague() {
        return league;
    }

    public String getPosition() {
        return position;
    }

    public Integer getOverall() {
        return overall;
    }

    public Integer getPace() {
        return pace;
    }

    public Integer getShooting() {
        return shooting;
    }

    public Integer getPassing() {
        return passing;
    }

    public Integer getDribbling() {
        return dribbling;
    }

    public Integer getDefending() {
        return defending;
    }

    public Integer getPhysical() {
        return physical;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setNation(String nation) {
        this.nation = nation;
    }

    public void setClub(String club) {
        this.club = club;
    }

    public void setLeague(String league) {
        this.league = league;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public void setOverall(Integer overall) {
        this.overall = overall;
    }

    public void setPace(Integer pace) {
        this.pace = pace;
    }

    public void setShooting(Integer shooting) {
        this.shooting = shooting;
    }

    public void setPassing(Integer passing) {
        this.passing = passing;
    }

    public void setDribbling(Integer dribbling) {
        this.dribbling = dribbling;
    }

    public void setDefending(Integer defending) {
        this.defending = defending;
    }

    public void setPhysical(Integer physical) {
        this.physical = physical;
    }
}
