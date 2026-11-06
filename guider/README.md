# JARMOK Guider 0.1
Samostatná statická BabylonJS aplikácia, bez Playgroundu a bez kompilácie.
Spustenie: z koreňa repozitára spusti statický HTTP server a otvor /guider/.
Na hosting sa kopíruje celý priečinok guider. Produkčná doména zatiaľ ostáva bez zmeny.

## Pôvod a hranice
Spôsob vytvorenia Engine, Scene, kamery a renderovacej slučky nadväzuje na slapiar/CoolBabylon/index.html (blob 10eb1a2dc2556dbee823ec6b4db3eadc8d37b506).
Rozcestník TEREM bol vizuálne overený ako vzor; jeho zdrojový kód zatiaľ nebol importovaný. Toto nie je napojenie na jeho renderer.
Obsah je v entries v guider.js. Rovnaké akcie obsluhuje 3D scéna aj prístupná HTML navigácia.
Voľný text sa nikam neposiela; používateľ ho môže skopírovať. CRM, odosielanie a AI zatiaľ nie sú pripojené.
Babylon sa načítava z rovnakého CDN ako existujúci základ. Pred ostrým nasadením treba pripnúť overenú verziu alebo uložiť knižnicu lokálne.
Horizons export zostáva zachovaný do overenia a schválenia náhrady.
