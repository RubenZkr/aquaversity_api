require("dotenv").config();

const mysql = require("mysql2/promise");


const pool = mysql.createPool({
  host: "aquaversity-api-server.mysql.database.azure.com",
  user: "vyaasndysq",
  password: "B$86b04WtmiI4HXc",
  database: "aquaversity",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
});


module.exports = pool;

/*
user
Password1234!!!!
Aquaversity

CREATE DATABASE aquaversity;

SHOW DATABASES;

USE aquaversity;
CREATE TABLE users (
                      id VARCHAR(255) PRIMARY KEY,
                      email VARCHAR(255) NOT NULL UNIQUE,
                      password VARCHAR(255) NOT NULL,
                      role VARCHAR(255) DEFAULT 'user'
);


CREATE TABLE ForumPost (
                           id VARCHAR(255) PRIMARY KEY,
                           writtenByUserId VARCHAR(255),
                           text TEXT,
                           author VARCHAR(255),
                           title VARCHAR(255),
                           date DATE,
                           likes INT,
                           FOREIGN KEY (writtenByUserId) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE ForumReply (
                            id VARCHAR(255) PRIMARY KEY,
                            userId VARCHAR(255),
                            forumPostId VARCHAR(255),
                            text TEXT,
                            likes INT,
                            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (forumPostId) REFERENCES ForumPost(id) ON DELETE CASCADE
);


CREATE TABLE LikedReply (
                            userId VARCHAR(255),
                            replyId VARCHAR(255),
                            PRIMARY KEY (userId, replyId),
                            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (replyId) REFERENCES ForumReply(id) ON DELETE CASCADE
);
CREATE TABLE LikedPost (
                            userId VARCHAR(255),
                            postId VARCHAR(255),
                            PRIMARY KEY (userId, postId),
                            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (postId) REFERENCES ForumPost(id) ON DELETE CASCADE
);

CREATE TABLE UserForumPost (
                               userId VARCHAR(255),
                               forumPostId VARCHAR(255),
                               PRIMARY KEY (userId, forumPostId),
                               FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                               FOREIGN KEY (forumPostId) REFERENCES ForumPost(id) ON DELETE CASCADE
);

CREATE TABLE level (
                       id VARCHAR(255) PRIMARY KEY,
                       orderNumber INT NOT NULL,
                       content TEXT,
                       title VARCHAR(255),
                       isLockedForGuest BOOLEAN
);


CREATE TABLE completed_level (
                                 userId VARCHAR(255),
                                 levelId VARCHAR(255),
                                 completedOn DATE,
                                 PRIMARY KEY (userId, levelId),
                                 FOREIGN KEY (userId) REFERENCES users(id),
                                 FOREIGN KEY (levelId) REFERENCES Level(id)
);


CREATE TABLE examen_question (
                                 id VARCHAR(255) PRIMARY KEY,
                                 levelId VARCHAR(255),
                                 question TEXT,
                                 FOREIGN KEY (levelId) REFERENCES Level(id)
);


CREATE TABLE answer (
                        id VARCHAR(255) PRIMARY KEY,
                        questionId VARCHAR(255),
                        answer TEXT,
                        isCorrect BOOLEAN,
                        FOREIGN KEY (questionId) REFERENCES examen_question(id)
);

INSERT INTO Level (id, orderNumber, title, content, isLockedForGuest) VALUES
                                                                          (UUID(), 1, 'Level 1', '
                                                                          ### Level 1: Basishygiëne en Filtratie

#### Doel
In Level 1 leren gebruikers de basisprincipes van hygiëne en eenvoudige filtratiemethoden. Dit niveau legt de basis voor veilig drinkwater door basiskennis en -vaardigheden over handhygiëne en eenvoudige filtratie bij te brengen.

#### Tutorial: Handen Wassen

1. **Waarom Handen Wassen Belangrijk is:**
   - Handen wassen is essentieel om de verspreiding van ziekteverwekkers te voorkomen. Vuile handen kunnen bacteriën en virussen overbrengen naar water, voedsel en oppervlakken.

2. **Hoe je je Handen Moet Wassen:**
   - **Benodigdheden:** Schoon water, zeep (indien beschikbaar).
   - **Stappen:**
     1. Maak je handen nat met schoon water.
     2. Breng zeep aan op je handen.
     3. Wrijf je handen samen en zorg ervoor dat je alle delen wast, inclusief de rug van je handen, tussen je vingers en onder je nagels. Doe dit gedurende ten minste 20 seconden.
     4. Spoel je handen goed af met schoon water.
     5. Droog je handen met een schone doek of laat ze aan de lucht drogen.

#### Tutorial: Zand- en Grindfilter

1. **Waarom Filtratie Belangrijk is:**
   - Filtratie helpt om vuildeeltjes en sommige micro-organismen uit het water te verwijderen, waardoor het veiliger wordt om te drinken.

2. **Materialen:**
   - Een lege plastic fles, grind, zand, katoenen doek of filterpapier, schaar.

3. **Stappen:**
   - **Stap 1: Voorbereiding van de Fles:**
     - Snijd de onderkant van een plastic fles af met een schaar, zodat je een grote opening hebt.
   - **Stap 2: Laag Grind:**
     - Vul de fles met een laag van ongeveer 5 cm grind. Dit helpt om grotere deeltjes te filteren.
   - **Stap 3: Laag Zand:**
     - Voeg een laag van ongeveer 10 cm schoon zand bovenop het grind toe. Zand helpt om kleinere deeltjes te filteren.
   - **Stap 4: Katoenen Doek of Filterpapier:**
     - Plaats een stuk katoenen doek of filterpapier bovenop het zand. Dit voorkomt dat het zand met het gefilterde water mee spoelt.
   - **Stap 5: Filtratie:**
     - Giet langzaam vuil water door de fles. Het water zal door de lagen grind, zand en doek sijpelen, waardoor het gefilterd wordt.
     - Vang het gefilterde water op in een schone container.

#### Tips

- **Gebruik Schoon Materiaal:** Zorg ervoor dat het grind en zand schoon zijn voordat je ze in de fles doet. Spoel ze indien mogelijk eerst af met schoon water.
- **Regelmatig Onderhoud:** Vervang de lagen grind, zand en doek regelmatig om te voorkomen dat ze verstopt raken en minder effectief worden.
- **Test het Water:** Hoewel deze methode veel deeltjes verwijdert, is het belangrijk om te onthouden dat het water mogelijk nog steeds ziektekiemen bevat. Gebruik indien mogelijk aanvullende methoden zoals koken of zonlichtdesinfectie (SODIS) om het water verder te zuiveren.

#### Belang van Niveau 1
Het begrijpen en toepassen van basis hygiënepraktijken en eenvoudige filtratiemethoden is de eerste stap naar het verkrijgen van schoon drinkwater. Deze vaardigheden vormen de fundering voor complexere technieken in hogere niveaus en helpen om onmiddellijk de gezondheid en veiligheid te verbeteren.


                                                                          ', false),
                                                                          (UUID(), 2, 'Level 2', '### Level 2: Koken van Water

#### Doel
In Level 2 leren gebruikers hoe ze water kunnen koken om ziekteverwekkers te verwijderen. Dit niveau bouwt voort op de basisprincipes van filtratie uit Level 1 en introduceert een betrouwbare methode om water te zuiveren door middel van warmte.

#### Tutorial: Water Koken

1. **Verzamelen en Voorfilteren:**
   - **Waarom:** Verwijder eerst zichtbaar vuil en grote deeltjes om het kookproces effectiever te maken.
   - **Hoe:** Giet het water door een schone doek of zeef om grote deeltjes te verwijderen.

2. **Kookproces:**
   - **Materialen:** Een pot of pan, een warmtebron (zoals een kooktoestel, gasbrander, of open vuur).
   - **Stappen:**
     1. **Vul de pot:** Giet het voorgefilterde water in een schone pot of pan.
     2. **Verwarm het water:** Plaats de pot op de warmtebron en breng het water aan de kook.
     3. **Kooktijd:** Laat het water minimaal één minuut koken. Op grotere hoogtes (boven 2000 meter) moet je het water drie minuten laten koken omdat het kookpunt van water lager is op grotere hoogten.
     4. **Afkoelen:** Laat het gekookte water afkoelen voordat je het drinkt of opslaat.

3. **Opslag:**
   - **Waarom:** Schoon, gekookt water moet goed worden opgeslagen om herbesmetting te voorkomen.
   - **Hoe:** Bewaar het afgekoelde water in schone, afgesloten containers. Gebruik bij voorkeur containers die je goed kunt afsluiten en die schoon zijn.

#### Tips

- **Let op de kooktijd:** Zorg ervoor dat het water daadwerkelijk kookt (grote, rollende bubbels) gedurende ten minste één minuut.
- **Schone opslag:** Gebruik alleen schone containers om gekookt water op te slaan. Sluit de containers goed af om te voorkomen dat er vuil of ziektekiemen in komen.
- **Veilige warmtebron:** Zorg ervoor dat je een veilige en stabiele warmtebron gebruikt om ongelukken te voorkomen.
- **Controleer de hoogte:** Houd rekening met je locatie. Op grotere hoogtes moet je het water langer koken om dezelfde zuiverende werking te bereiken.

#### Belang van Niveau 2
Het koken van water is een essentiële vaardigheid om water veilig te maken voor consumptie. Deze methode is eenvoudig, effectief en maakt gebruik van minimale hulpmiddelen. Het biedt een betrouwbare manier om ziekteverwekkers zoals bacteriën, virussen en parasieten te doden.
', false),
                                                                          (UUID(), 3, 'Level 3', '### Level 3: Zonlicht Desinfectie (SODIS)

#### Doel
In Level 3 leren gebruikers hoe ze de kracht van zonlicht kunnen gebruiken om water te desinfecteren. Deze methode, bekend als SODIS (Solar Water Disinfection), maakt gebruik van UV-straling van de zon om bacteriën, virussen en parasieten in water te doden.

#### Tutorial: Zonlicht Desinfectie (SODIS)

1. **Verzamelen en Voorfilteren:**
   - **Waarom:** Verwijder zichtbaar vuil om de effectiviteit van de zonlichtdesinfectie te verbeteren.
   - **Hoe:** Giet het water door een schone doek of zeef om grote deeltjes te verwijderen.

2. **Voorbereiding van de Zonneflessen:**
   - **Materialen:** Doorzichtige plastic flessen (bij voorkeur PET-flessen), een reflecterend oppervlak (zoals een aluminium plaat of wit gelakt oppervlak).
   - **Stappen:**
     1. **Vul de flessen:** Vul de doorzichtige plastic flessen met het voorgefilterde water. Laat ongeveer 10% lucht bovenin de fles voor een betere zuurstofwerking.
     2. **Schudden:** Sluit de flessen goed af en schud ze krachtig gedurende 20 seconden. Dit helpt om zuurstof in het water te mengen, wat de desinfectie bevordert.
     3. **Plaats de flessen:** Plaats de gevulde flessen in direct zonlicht op een reflecterend oppervlak. Het reflecterende oppervlak helpt om de hoeveelheid zonlicht die op de flessen valt te vergroten.

3. **Belichtingstijd:**
   - **Waarom:** Het water moet gedurende een bepaalde tijd aan zonlicht worden blootgesteld om effectief te worden gedesinfecteerd.
   - **Hoe:** Laat de flessen minstens zes uur in direct zonlicht staan. Als het weer bewolkt is, verleng dan de blootstellingstijd tot twee volle dagen.

4. **Opslag en Gebruik:**
   - **Waarom:** Schoon, gedesinfecteerd water moet goed worden opgeslagen om herbesmetting te voorkomen.
   - **Hoe:** Bewaar het gedesinfecteerde water in schone, afgesloten containers. Gebruik bij voorkeur containers die je goed kunt afsluiten en die schoon zijn.

#### Tips

- **Zonnige dagen:** Voor optimale resultaten moet je deze methode op zonnige dagen gebruiken. Bewolkte dagen vereisen een langere belichtingstijd.
- **Reflecterend oppervlak:** Gebruik een reflecterend oppervlak zoals aluminium folie of een wit gelakt oppervlak om de effectiviteit van de UV-stralen te vergroten.
- **Flessenmateriaal:** Gebruik doorzichtige plastic (PET) flessen, geen glazen flessen, omdat glas UV-stralen kan blokkeren.

#### Belang van Niveau 3
Zonlichtdesinfectie is een eenvoudige, kosteneffectieve methode die gebruik maakt van natuurlijke bronnen. Het is vooral nuttig in gebieden waar brandstof en technologie beperkt zijn. SODIS biedt een betrouwbare manier om microbiologische verontreinigingen in water te verminderen en zo de gezondheid van gemeenschappen te verbeteren.

', false),
                                                                          (UUID(), 4, 'Level 4', '### Level 4: Chloreren

#### Doel
In Level 4 leren gebruikers hoe ze chloor kunnen gebruiken om water te desinfecteren. Chloreren is een effectieve manier om bacteriën, virussen en andere pathogenen in water te doden, waardoor het veilig wordt om te drinken.

#### Tutorial: Water Chloreren

1. **Verzamelen en Voorfilteren:**
   - **Waarom:** Verwijder zichtbaar vuil om de effectiviteit van het chloor te verbeteren.
   - **Hoe:** Giet het water door een schone doek of zeef om grote deeltjes te verwijderen.

2. **Chloor Bereiden:**
   - **Materialen:** Ongeparfumeerd vloeibaar huishoudbleekmiddel (met een concentratie van 5-6% natriumhypochloriet), druppelaar of lepel voor nauwkeurige dosering.
   - **Stappen:**
     1. **Dosering:** Voeg 2 druppels ongeparfumeerd bleekmiddel per liter water toe. Voor grotere hoeveelheden, voeg 8 druppels (of 1/8 theelepel) toe per gallon water.
     2. **Roeren:** Roer het water goed om het chloor gelijkmatig te verdelen.

3. **Inwerktijd:**
   - **Waarom:** Het chloor heeft tijd nodig om alle ziekteverwekkers te doden.
   - **Hoe:** Laat het water minimaal 30 minuten staan voordat je het drinkt. Het water moet een lichte chloorgeur hebben; als dit niet het geval is, voeg dan dezelfde hoeveelheid chloor opnieuw toe en wacht nog eens 30 minuten.

4. **Opslag:**
   - **Waarom:** Schoon, gechloreerd water moet goed worden opgeslagen om herbesmetting te voorkomen.
   - **Hoe:** Bewaar het gechloreerde water in schone, afgesloten containers. Gebruik bij voorkeur containers die je goed kunt afsluiten en die schoon zijn.

#### Tips

- **Gebruik van ongeparfumeerd bleekmiddel:** Zorg ervoor dat het bleekmiddel ongeparfumeerd is en geen andere toevoegingen bevat die schadelijk kunnen zijn.
- **Nauwkeurige dosering:** Gebruik een druppelaar of lepel om de juiste hoeveelheid chloor nauwkeurig af te meten.
- **Chloorgeur:** Het water moet na behandeling een lichte chloorgeur hebben. Dit duidt op een voldoende concentratie van chloor voor desinfectie.
- **Vermijd overdosering:** Voeg niet meer chloor toe dan aanbevolen, aangezien te veel chloor schadelijk kan zijn voor de gezondheid.

#### Belang van Niveau 4
Chloreren is een veelgebruikte en effectieve methode om water te desinfecteren, vooral in situaties waar koken of SODIS niet praktisch zijn. Het is een snelle manier om grote hoeveelheden water veilig te maken en kan levensreddend zijn in noodsituaties.

', true),
                                                                          (UUID(), 5, 'Level 5', '### Level 5: Biosand Filters

#### Doel
In Level 5 leren gebruikers hoe ze een biosand filter kunnen bouwen en gebruiken. Dit type filter is zeer effectief in het verwijderen van verontreinigingen en ziekteverwekkers uit water door middel van biologische en fysieke processen.

#### Tutorial: Bouw en Gebruik van een Biosand Filter

1. **Materialen Verzamelen:**
   - PVC-buis of een ander soort stevige container
   - Schoon grind
   - Schoon zand
   - Schone doek of filterpapier
   - Kleine stenen

2. **Voorbereiding en Constructie:**
   - **Basislaag:**
     1. **Kleine Stenen:** Begin met een laag kleine stenen (ongeveer 5 cm) onderin de container. Deze laag helpt om de afvoer te ondersteunen.
   - **Grindlaag:**
     1. **Grof Grind:** Voeg een laag grof grind (ongeveer 5 cm) bovenop de kleine stenen toe.
   - **Zandlaag:**
     1. **Fijn Zand:** Voeg een laag fijn zand (ongeveer 50 cm) bovenop het grind toe. Dit zand fungeert als het belangrijkste filtermedium.
   - **Biologische Laag:**
     1. **Biosand Laag:** Laat de filter een aantal weken draaien met water om de biologische laag op het zand te laten groeien. Deze laag helpt bij de afbraak van organische stoffen en ziekteverwekkers.

3. **Gebruik van het Biosand Filter:**
   - **Voorfilteren:**
     1. **Voorfiltratie:** Voorfiltreer het water door een doek om grote deeltjes te verwijderen voordat het in het biosand filter gaat.
   - **Filteren:**
     1. **Water Invoeren:** Giet langzaam vuil water bovenop de zandlaag. Het water zal door de lagen van zand, grind en stenen stromen en worden gefilterd.
     2. **Water Opvangen:** Vang het gefilterde water op in een schone container.

4. **Onderhoud en Schoonmaken:**
   - **Regelmatig Onderhoud:** Verwijder regelmatig de bovenste laag van het zand om te voorkomen dat het verstopt raakt.
   - **Schoonmaken:** Spoel de stenen en het grind indien nodig om ophoping van vuil te voorkomen.

#### Tips

- **Gebruik Schoon Materiaal:** Zorg ervoor dat het zand en grind schoon zijn voordat je ze in de filter plaatst. Spoel ze indien mogelijk eerst af met schoon water.
- **Langzaam Filtreren:** Laat het water langzaam door de filter stromen om de effectiviteit te maximaliseren.
- **Onderhoud:** Controleer en onderhoud het filter regelmatig om verstoppingen en verminderde effectiviteit te voorkomen.

#### Belang van Niveau 5
Een biosand filter biedt een langdurige en efficiënte manier om water te zuiveren. Deze methode maakt gebruik van zowel fysieke als biologische processen om verontreinigingen te verwijderen en is bijzonder nuttig in gebieden zonder toegang tot chemische desinfectiemiddelen of betrouwbare warmtebronnen.

### Toetsvraag voor Level 5

**Vraag:**
Wat is het belangrijkste doel van de biologische laag in een biosand filter?

a) Het water sneller laten stromen  
b) Het ondersteunen van de afvoer  
c) De afbraak van organische stoffen en ziekteverwekkers  
d) Het geven van smaak aan het water

**Antwoord:**
c) De afbraak van organische stoffen en ziekteverwekkers', true),
                                                                          (UUID(), 6, 'Level 6', '### Level 6: Keramische Filters

#### Doel
In Level 6 leren gebruikers hoe ze keramische filters kunnen gebruiken om water te zuiveren. Keramische filters zijn effectief in het verwijderen van bacteriën, protozoa en andere verontreinigingen door middel van een fysiek filtratieproces.

#### Tutorial: Gebruik van een Keramische Filter

1. **Verzamelen en Voorfilteren:**
   - **Waarom:** Verwijder zichtbaar vuil om de effectiviteit van het keramische filter te verbeteren.
   - **Hoe:** Giet het water door een schone doek of zeef om grote deeltjes te verwijderen.

2. **Voorbereiding van de Keramische Filter:**
   - **Materialen:** Keramische filterpot (of filterelement), schone opvangcontainer.
   - **Stappen:**
     1. **Controleer de Filter:** Zorg ervoor dat de keramische filterpot of het filterelement schoon en niet beschadigd is.
     2. **Plaats de Filter:** Zet de keramische filterpot in of op de opvangcontainer zodat het gefilterde water direct in een schone container kan stromen.

3. **Filteren van het Water:**
   - **Stappen:**
     1. **Giet het Water in de Filter:** Giet langzaam het voorgefilterde water in de keramische filterpot.
     2. **Wachten:** Laat het water door de keramische filter stromen. Dit kan enige tijd duren, afhankelijk van de hoeveelheid water en de conditie van de filter.
     3. **Opvangen:** Vang het gefilterde water op in de schone container.

4. **Onderhoud en Schoonmaken:**
   - **Regelmatig Onderhoud:** Reinig de keramische filterpot regelmatig om verstoppingen te voorkomen en de doorstroomsnelheid te behouden.
   - **Schoonmaken:** Gebruik een zachte borstel en schoon water om de buitenkant van de keramische filter te reinigen. Vermijd het gebruik van zeep of schoonmaakmiddelen.

#### Tips

- **Langzaam Gieten:** Giet het water langzaam in de keramische filter om te voorkomen dat het filterelement verstopt raakt.
- **Regelmatige Reiniging:** Reinig de keramische filterpot regelmatig om de effectiviteit te behouden. Dit kan wekelijks of vaker zijn, afhankelijk van de waterkwaliteit en het gebruik.
- **Controleer op Beschadigingen:** Zorg ervoor dat de keramische filterpot niet gebarsten of beschadigd is, aangezien dit de filterprestaties kan verminderen en verontreinigingen kan doorlaten.

#### Belang van Niveau 6
Keramische filters bieden een betrouwbare en duurzame oplossing voor het zuiveren van water. Ze zijn vooral nuttig in gebieden met beperkte toegang tot chemische desinfectiemiddelen of elektriciteit. Door middel van fysieke filtratie kunnen ze effectief bacteriën en protozoa verwijderen, waardoor het water veiliger wordt om te drinken.

### Toetsvraag voor Level 6

**Vraag:**
Wat moet je regelmatig doen om de effectiviteit van een keramische filter te behouden?

a) De filterpot in de zon leggen  
b) De filterpot met zeep schoonmaken  
c) De filterpot met een zachte borstel en schoon water reinigen  
d) De filterpot in de vriezer bewaren

**Antwoord:**
c) De filterpot met een zachte borstel en schoon water reinigen', true),
                                                                          (UUID(), 7, '### Level 7: Plantengebaseerde Zuivering

#### Doel
In Level 7 leren gebruikers hoe ze natuurlijke middelen zoals moringazaden of bananenschillen kunnen gebruiken om water te zuiveren. Deze methode maakt gebruik van de natuurlijke eigenschappen van bepaalde planten om verontreinigingen en micro-organismen uit water te verwijderen.

#### Tutorial: Plantengebaseerde Zuivering

1. **Verzamelen en Voorfilteren:**
   - **Waarom:** Verwijder zichtbaar vuil om de effectiviteit van de plantengebaseerde zuivering te verbeteren.
   - **Hoe:** Giet het water door een schone doek of zeef om grote deeltjes te verwijderen.

2. **Gebruik van Moringazaden:**
   - **Materialen:** Gedroogde moringazaden, vijzel of stamper, schone doek of filterpapier.
   - **Stappen:**
     1. **Verzamel Moringazaden:** Verzamel voldoende gedroogde moringazaden.
     2. **Vermaal de Zaden:** Vermaal de zaden tot een fijn poeder met een vijzel en stamper.
     3. **Toevoegen aan Water:** Voeg het moringazaadpoeder toe aan het voorgefilterde water (ongeveer één zaad per liter water).
     4. **Roeren:** Roer het water krachtig gedurende ten minste vijf minuten.
     5. **Bezinken:** Laat het water 30 minuten staan zodat de vaste deeltjes kunnen bezinken.
     6. **Filtreren:** Giet het heldere water door een schone doek of filterpapier om het te scheiden van het bezinksel.

3. **Gebruik van Bananenschillen:**
   - **Materialen:** Verse bananenschillen, mes, schone doek of filterpapier.
   - **Stappen:**
     1. **Verzamel Bananenschillen:** Verzamel verse bananenschillen en snijd ze in kleine stukjes.
     2. **Toevoegen aan Water:** Voeg de stukjes bananenschil toe aan het voorgefilterde water.
     3. **Roeren:** Roer het water krachtig gedurende ten minste vijf minuten.
     4. **Bezinken:** Laat het water 30 minuten staan zodat de vaste deeltjes kunnen bezinken.
     5. **Filtreren:** Giet het heldere water door een schone doek of filterpapier om het te scheiden van het bezinksel.

4. **Opslag:**
   - **Waarom:** Schoon water moet goed worden opgeslagen om herbesmetting te voorkomen.
   - **Hoe:** Bewaar het gezuiverde water in schone, afgesloten containers. Gebruik bij voorkeur containers die je goed kunt afsluiten en die schoon zijn.

#### Tips

- **Gebruik Vers Materiaal:** Zorg ervoor dat de bananenschillen vers zijn en de moringazaden goed gedroogd en schoon.
- **Goed Roeren:** Roer het water goed om de zuiverende stoffen gelijkmatig te verspreiden.
- **Geduld bij Bezinken:** Geef het water voldoende tijd om te bezinken zodat de vaste deeltjes kunnen scheiden.

#### Belang van Niveau 7
Plantengebaseerde zuivering biedt een alternatieve, natuurlijke manier om water te zuiveren, vooral nuttig in gebieden waar moderne zuiveringstechnieken niet beschikbaar zijn. Deze methoden zijn goedkoop, gemakkelijk toegankelijk en kunnen effectief zijn in het verwijderen van bepaalde verontreinigingen en micro-organismen.
', 'Informatie 7', true),
                                                                          (UUID(), 8, 'Level 8', '### Level 8: DIY Zuiveringsinstallatie

#### Doel
In Level 8 leren gebruikers hoe ze een eigen waterzuiveringsinstallatie kunnen bouwen en gebruiken. Deze methode maakt gebruik van verschillende lagen natuurlijke materialen om water te filteren en te zuiveren.

#### Tutorial: Bouw en Gebruik van een DIY Zuiveringsinstallatie

1. **Materialen Verzamelen:**
   - Schoon grind
   - Schoon zand
   - Actieve kool (geactiveerde houtskool)
   - PVC-buizen of emmers
   - Boor en boortjes
   - Schone doek of filterpapier
   - Kiezels

2. **Voorbereiding en Constructie:**
   - **Basislaag:**
     1. **Kiezels:** Begin met een laag kiezels (ongeveer 5 cm) onderin de container. Deze laag helpt om de afvoer te ondersteunen.
   - **Grindlaag:**
     1. **Grof Grind:** Voeg een laag grof grind (ongeveer 5 cm) bovenop de kiezels toe.
   - **Actieve Koollaag:**
     1. **Actieve Kool:** Voeg een laag actieve kool (ongeveer 10 cm) bovenop het grind toe. Actieve kool helpt om chemische verontreinigingen te verwijderen.
   - **Zandlaag:**
     1. **Fijn Zand:** Voeg een laag fijn zand (ongeveer 50 cm) bovenop de actieve kool toe. Dit zand fungeert als het belangrijkste filtermedium.
   - **Bouw de Filter:**
     1. **PVC-buis:** Boor kleine gaatjes in de PVC-buis en plaats deze in het midden van de emmer om de afvoer te vergemakkelijken.
     2. **Laagvolgorde:** Stapel de lagen van onder naar boven in de emmer of container: kiezels, grof grind, actieve kool, fijn zand.

3. **Gebruik van de Zuiveringsinstallatie:**
   - **Voorfilteren:**
     1. **Voorfiltratie:** Giet het water door een doek om grote deeltjes te verwijderen voordat het in de zuiveringsinstallatie gaat.
   - **Filteren:**
     1. **Water Invoeren:** Giet langzaam vuil water bovenop de zandlaag. Het water zal door de verschillende lagen stromen en worden gefilterd.
     2. **Water Opvangen:** Vang het gefilterde water op in een schone container.

4. **Onderhoud en Schoonmaken:**
   - **Regelmatig Onderhoud:** Reinig de bovenste laag van het zand regelmatig om verstoppingen te voorkomen. Vervang de actieve kool indien nodig.
   - **Schoonmaken:** Spoel de kiezels en het grind indien nodig om ophoping van vuil te voorkomen.

#### Tips

- **Gebruik Schoon Materiaal:** Zorg ervoor dat het zand, grind en kiezels schoon zijn voordat je ze in de filter plaatst. Spoel ze indien mogelijk eerst af met schoon water.
- **Regelmatige Vervanging:** Vervang de actieve kool regelmatig om de effectiviteit van de chemische filtratie te behouden.
- **Langzaam Filtreren:** Laat het water langzaam door de filter stromen om de maximale effectiviteit te bereiken.

#### Belang van Niveau 8
Een DIY waterzuiveringsinstallatie biedt een effectieve manier om water te zuiveren met behulp van verschillende natuurlijke materialen en fysieke processen. Dit type filter is duurzaam en kan herhaaldelijk worden gebruikt met regelmatig onderhoud, wat het ideaal maakt voor langdurig gebruik in gebieden met beperkte toegang tot schoon water.

', true),
                                                                          (UUID(), 9, 'Level 9', '### Level 9: Geavanceerde Filtratie en Zuivering

#### Doel
In Level 9 leren gebruikers hoe ze geavanceerde methoden zoals UV-filters en omgekeerde osmose kunnen gebruiken om water te zuiveren. Deze methoden zijn zeer effectief in het verwijderen van een breed scala aan verontreinigingen, inclusief bacteriën, virussen, chemicaliën en zware metalen.

#### Tutorial: Geavanceerde Filtratie en Zuivering

1. **Verzamelen en Voorfilteren:**
   - **Waarom:** Verwijder zichtbaar vuil om de effectiviteit van de geavanceerde zuiveringstechnieken te verbeteren.
   - **Hoe:** Giet het water door een schone doek of zeef om grote deeltjes te verwijderen.

2. **Gebruik van UV-filters:**
   - **Materialen:** UV-filterapparaat, schone opvangcontainer, stroombron (elektriciteit of zonne-energie).
   - **Stappen:**
     1. **Installatie:** Plaats het UV-filterapparaat volgens de instructies van de fabrikant. Zorg ervoor dat het apparaat goed is aangesloten op de stroombron.
     2. **Water Invoeren:** Giet het voorgefilterde water in het UV-filterapparaat.
     3. **Desinfectie:** Laat het water door het UV-filter stromen, waar het wordt blootgesteld aan UV-licht dat bacteriën, virussen en andere micro-organismen doodt.
     4. **Opvangen:** Vang het gedesinfecteerde water op in een schone container.

3. **Gebruik van Omgekeerde Osmose:**
   - **Materialen:** Omgekeerde osmose (RO) systeem, schone opvangcontainer, stroombron (elektriciteit).
   - **Stappen:**
     1. **Installatie:** Installeer het RO-systeem volgens de instructies van de fabrikant. Zorg ervoor dat alle slangen en filters goed zijn aangesloten.
     2. **Water Invoeren:** Giet het voorgefilterde water in het RO-systeem.
     3. **Zuivering:** Laat het water door de verschillende filters van het RO-systeem stromen, waar het door een semi-permeabel membraan wordt geduwd dat verontreinigingen verwijdert.
     4. **Opvangen:** Vang het gezuiverde water op in een schone container.

4. **Opslag:**
   - **Waarom:** Schoon, gezuiverd water moet goed worden opgeslagen om herbesmetting te voorkomen.
   - **Hoe:** Bewaar het gezuiverde water in schone, afgesloten containers. Gebruik bij voorkeur containers die je goed kunt afsluiten en die schoon zijn.

#### Tips

- **Volg de instructies:** Zorg ervoor dat je de installatie- en gebruiksaanwijzingen van de fabrikant nauwkeurig volgt voor zowel UV-filters als RO-systemen.
- **Regelmatig Onderhoud:** Vervang de UV-lamp en RO-filters regelmatig zoals aanbevolen door de fabrikant om de effectiviteit te behouden.
- **Controleer de stroombron:** Zorg ervoor dat je een betrouwbare stroombron hebt voor het gebruik van deze geavanceerde zuiveringsmethoden.

#### Belang van Niveau 9
Geavanceerde filtratie- en zuiveringsmethoden zoals UV-filters en omgekeerde osmose bieden een hoge mate van waterzuivering, waardoor ze geschikt zijn voor het verwijderen van een breed scala aan verontreinigingen. Deze methoden zijn bijzonder nuttig in situaties waar maximale waterveiligheid vereist is, zoals in gezondheidszorginstellingen of gebieden met ernstige watervervuiling.
', true);






select * from level;


*/

