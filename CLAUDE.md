# CLAUDE.md — school-api

## Project Overview

`school-api` is a minimal Spring Boot REST API that exposes CRUD operations for `Person` records. It is in early-stage development with only two source files and no test coverage yet.

- **Language:** Java 8
- **Framework:** Spring Boot 1.5.7.RELEASE
- **Build tool:** Gradle 3.3 (via wrapper)
- **Database:** H2 in-memory (no persistence between restarts)
- **REST layer:** Spring Data REST (auto-generates endpoints from repository interfaces)

---

## Repository Structure

```
school/
├── src/
│   └── main/
│       └── java/
│           └── com/school/domain/
│               ├── Person.java                          # JPA entity
│               └── repositories/
│                   └── PersonRepository.java            # Spring Data REST repository
├── gradle/wrapper/
│   └── gradle-wrapper.properties                       # Pins Gradle 3.3
├── .idea/                                              # IntelliJ IDEA project files
├── gradlew / gradlew.bat                               # Gradle wrapper scripts
└── README.md
```

There is no `build.gradle` tracked in the repository — the project was initialized through IntelliJ with Gradle integration. Dependencies are declared in the IDE module files under `.idea/`.

---

## Common Commands

```bash
# Build
./gradlew build

# Run the application (available at http://localhost:8080)
./gradlew bootRun

# Run tests (no tests exist yet)
./gradlew test

# Clean build artifacts
./gradlew clean
```

---

## REST API Endpoints

Spring Data REST automatically exposes the following endpoints for the `PersonRepository`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/people` | List all people (paginated) |
| GET | `/people/{id}` | Get person by ID |
| POST | `/people` | Create a person |
| PUT | `/people/{id}` | Replace a person |
| PATCH | `/people/{id}` | Partial update |
| DELETE | `/people/{id}` | Delete a person |
| GET | `/people/search/findByLastName?name=<value>` | Search by last name |

---

## Domain Model

### `Person` (`com.school.domain.Person`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | `long` | Auto-generated primary key |
| `firstName` | `String` | |
| `lastName` | `String` | |

### `PersonRepository` (`com.school.domain.repositories.PersonRepository`)

Extends `PagingAndSortingRepository<Person, Long>` and is annotated with `@RepositoryRestResource(collectionResourceRel = "people", path = "people")`.

Custom query method: `findByLastName(@Param("name") String name)`.

---

## Known Issues

- **Package mismatch:** `PersonRepository.java` declares `package hello;` at the top of the file but lives under `src/main/java/com/school/domain/repositories/`. The correct package should be `com.school.domain.repositories`. The import for `Person` is also missing. This will cause a compilation failure and must be fixed before the project can build.

---

## Development Conventions

- **Package root:** `com.school` — all new code goes under this root.
- **Entities** go in `com.school.domain`.
- **Repositories** go in `com.school.domain.repositories`.
- **No configuration files** are present; Spring Boot auto-configuration is used throughout. Add `src/main/resources/application.properties` if custom configuration is needed.
- **Database schema** is managed by Hibernate's `ddl-auto` (default: `create-drop` with H2). There are no migration scripts; add Flyway or Liquibase if persistent schema management is required.
- **No test coverage exists.** New features should include JUnit 4 tests under `src/test/java/`. Spring Boot Test, Mockito, and AssertJ are already on the test classpath.

---

## Dependencies (Key)

| Dependency | Version |
|-----------|---------|
| Spring Boot | 1.5.7.RELEASE |
| Spring Data JPA | 1.11.7.RELEASE |
| Spring Data REST | 2.6.7.RELEASE |
| Hibernate | 5.0.12.Final |
| H2 Database | 1.4.196 |
| Tomcat (embedded) | 8.5.20 |
| Jackson | 2.8.10 |
| JUnit | 4.12 |
| Mockito | 1.10.19 |
| AssertJ | 2.6.0 |

---

## Git Workflow

- Main branch: `master`
- Feature branches follow the pattern `claude/<description>` or similar.
- The project uses a local proxy remote (`origin`).
- No CI/CD is configured.
