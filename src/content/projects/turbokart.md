---
title: "TurboKart"
shortDesc: "TurboKart er et projekt, der fokuserer på at forstå og anvende forskellige designmønstre sammen med CLEAN arkitekturer. TurboKart blev anvendt i forbindelse med min S4.1 Distributed Systems eksamen."
githubLink: "https://github.com/Jonas-Beck/TurboKart"
showOnFrontpage: true
date: 2024-02-02
tags:
    - C#
    - gRPC
    - SignalR
    - Blazor WASM
    - Razor Pages
    - EF Core
    - REST API
    - Microservices
---

## Oversigt

TurboKart er et projekt udviklet ved hjælp af CLEAN Architecture og inkorporerer centrale designmønstre som Unit of Work (UoW), Repositories, Dependency Injection (DI) og Inversion of Control (IoC). Dette projekt indeholder 3 forskellige hjemmesider:

1. **TurboKartDK**: Implementeret med Razor Pages.
2. **TurboKart Booking Management**: Implementeret med C# MVC.
3. **TurboKartLIVE**: Implementeret med Blazor WebAssembly.

Derudover er der en konsolapplikation, der simulerer racer-tider. Applikationen bruger gRPC til at sende data til en gRPC-tjeneste, som derefter kommunikerer med TurboKartLIVE ved hjælp af SignalR.

## Indholdsfortegnelse

-   [Mappestruktur](#mappestruktur)
-   [Hjemmesider](#hjemmesider)
    -   [1. TurboKartDK](#1-turbokartdk)
    -   [2. TurboKart Booking Management](#2-turbokart-booking-management)
    -   [3. TurboKartLIVE](#3-turbokartlive)
-   [Konsolapplikation](#konsolapplikation)
-   [gRPC-tjeneste og SignalR](#grpc-tjeneste-og-signalr)
-   [API](#api)
-   [Anerkendelser](#anerkendelser)

## Mappestruktur

Løsningen er struktureret ved hjælp af solution folders, der passer til Clean Architecture-lagene: Domain, Application, Presentation og Infrastructure.

-   **Presentation**

    -   **Websites**: Indeholder TurboKarts webapplikationer som TurboKartDK, TurboKart Booking Management og TurboKartLIVE.
    -   **API**: Indeholder TurboKarts web-API'er.
    -   **Console**: Indeholder konsolapplikationen, der er ansvarlig for at simulere racer-tider.
    -   **Service**: Håndterer gRPC-tjenesten, der er ansvarlig for at håndtere data fra konsolapplikationen og interagere med TurboKartLIVE ved hjælp af SignalR.

-   **Infrastructure**

    -   **Networking**: Indeholder mine serviceklasser, der er ansvarlige for at håndtere opkald til mit API fra hjemmesider.
    -   **Persistence**: Håndterer persistenslaget og håndtering af dataopbevaring og -hentning.

-   **Application**: Indeholder applikationslogikken, herunder use cases og forretningsregler.

-   **Domain**: Indeholder den centrale domænelogik, der definerer enheder, værdigenstande og domæneservices.

## Hjemmesider

### 1. TurboKartDK

TurboKartDK fungerer som den officielle hjemmeside for TurboKart, der giver brugerne mulighed for at booke en gokart-session. Hjemmesiden giver væsentlige oplysninger såsom priser, beskrivelser af forskellige gokart-typer, kontaktoplysninger og åbningstider.

**Nøglefunktioner og -funktionaliteter:**

-   Bookingssystem: Brugere kan booke en gokart-session og vælge gokart-type.
-   Gokartoplysninger: Detaljeret information om forskellige gokart-typer, herunder specifikationer og priser.
-   Kontaktoplysninger: Brugere kan finde relevante kontaktoplysninger til forespørgsler og support.
-   Åbningstider: Tydelig præsentation af TurboKarts driftstider for brugernes bekvemmelighed.

**Implementeringsdetaljer:**
TurboKartDK er implementeret ved hjælp af ASP.NET Core Razor Pages.

### 2. TurboKart Booking Management

TurboKart Booking Management er et internt værktøj oprettet til at administrere aktuelle bookinger, tilføje nye bookinger, slette nye bookinger og redigere eksisterende.

**Nøglefunktioner og -funktionaliteter:**

-   Bookingsoversigt
-   Tilføj bookinger
-   Slet bookinger
-   Rediger bookinger

**Implementeringsdetaljer:**
TurboKart Booking Management er implementeret ved hjælp af ASP.NET Core MVC.

### 3. TurboKartLIVE

TurboKartLIVE er en hjemmeside til visning af live-racetider ved hjælp af SignalR til at kommunikere i realtid.

**Implementeringsdetaljer:**
TurboKartLIVE er implementeret ved hjælp af ASP.NET Core Blazor WebAssembly.

## Konsolapplikation

Konsolapplikationen er en tilpasset version, der bruger gRPC til at sende gokart-data. Den er afledt af et projekt, der blev stillet til rådighed for vores brug, med ændringer foretaget for at muliggøre gRPC. Du kan henvise til [Original Version](https://github.com/mads-mikkel/Turbokart/tree/master/src/Application/Marada.LapTimer.Simulation) for sammenligning.

## gRPC-tjeneste og SignalR

gRPC-tjenesten er ansvarlig for at håndtere gRPC-anmodninger fra min konsolapplikation og sende data til TurboKartLIVE ved hjælp af SignalR.

## API

TurboKartAPI er ansvarlig for al forbindelse til databasen ved hjælp af mine Application UseCase implementeringer. API'en indeholder controllere for alle mine domæneenheder.

## Anerkendelser

Dette projekt blev brugt i min S4.1-eksamen (Software Construction: Distributed Systems) den 18/01/2024 og modtog en karakter på 12.
