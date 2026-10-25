import { questionCategories } from "./questionCategories.js";
import { messages } from "./messages.js";
import { inDepthPages } from "./inDepth.js";

// Pages outside Poglobljeno retain their existing content.
const presentationPages = [
  {
    slug: "uvod",
    title: "Uvod za nove bralce",
    intro:
      "Kratek pregled osrednjega sporočila Share International: prihod Maitreje, svetovnega učitelja, in njegovo sporočilo upanja za prihodnost.",
    sections: [
      [
        "Učitelj za vse človeštvo",
        "Vse velike svetovne religije pričakujejo novo razodetje, ki ga bo prinesel prihodnji učitelj. Kristjani upajo na Kristusovo vrnitev, budisti pričakujejo novega Budo, gospoda Maitrejo, nekateri muslimani imama Mahdija, hindujci ponovno utelešenje Krišne in judje Mesijo.",
        "Učenci ezoterične tradicije razumejo ta imena kot različna poimenovanja istega posameznika: Maitreje, svetovnega učitelja. Pričakujejo njegovo vrnitev na čelu skupine mojstrov modrosti. To so ljudje, ki so po poti razvoja napredovali pred nami ter so človeštvo od nekdaj vodili in navdihovali iz ozadja.",
        "Maitreja želi biti znan preprosto kot Učitelj. Ne prihaja kot verski voditelj, temveč kot vzgojitelj v najširšem pomenu besede, ki kaže pot iz najtežjih težav človeštva. V času politične, gospodarske, družbene in okoljske krize naj bi človeštvo navdihnil, da se prepozna kot ena družina in ustvari civilizacijo, ki temelji na medsebojni delitvi, pravičnosti in sodelovanju.",
      ],
      [
        "Maitrejevi nauki in prednostne naloge",
        "Maitreja ne namerava ustanoviti nove religije ali zbirati sledilcev. Človeštvo želi učiti umetnosti samouresničevanja. Prvi koraki so poštenost uma, iskrenost duha in nenavezanost.",
        "Njegove družbene prednostne naloge so zadostna količina primerne hrane, ustrezna bivališča za vse ter zdravstveno varstvo in izobraževanje kot univerzalni pravici. Po odpravi lakote naj bi bila najpomembnejša naloga reševanje okolja. Njegovo družbeno sporočilo je mogoče povzeti z besedami: delite dobrine in rešite svet.",
        "Maitreja je prepričan, da bo človeštvo sprejelo njegovo sporočilo in da stojimo na pragu dobe miru in dobre volje.",
      ],
      [
        "Maitrejev prihod",
        "Glavni vir informacij o Maitrejevem prihodu je bil britanski umetnik in pisec Benjamin Creme. O tem je govoril in pisal od sredine sedemdesetih let do smrti leta 2016. Po njegovih navedbah je Maitreja julija 1977 zapustil svoje starodavno zatočišče v Himalaji in se naselil v indijsko-pakistanski skupnosti v Londonu. Tam naj bi živel kot na videz običajen človek, čigar pravi položaj poznajo le redki.",
        "V javnosti naj bi se razkrival postopoma, da ne bi posegel v svobodno voljo človeštva. Creme je njegovemu delovanju iz ozadja pripisoval spodbudo za pozitivne spremembe, med njimi konec apartheida, približevanje Vzhoda in Zahoda, krepitev glasu ljudstva in svetovno skrb za okolje.",
        "Kot sodoben človek, ki se ukvarja z današnjimi težavami, naj bi Maitreja od leta 1977 deloval na različnih ravneh in človeštvo pripravljal na svojo javno navzočnost. Creme je med spremembami, ki jih je povezoval s tem vplivom, navajal tudi padec komunizma v Sovjetski zvezi.",
      ],
      [
        "Maitrejeva pojavljanja",
        "Po navedbah Share International se je Maitreja leta 1988 začel pojavljati znanim voditeljem in običajnim ljudem, osebno in v sanjah. Dne 11. junija 1988 se je pojavil pred približno 6.000 udeleženci molitvenega in zdravilnega srečanja na prostem v Nairobiju v Keniji. Dogodek je s fotografijami objavil časopis Kenya Times.",
        "Spletno mesto poroča, da se je do leta 2001 pojavljal na srečanjih različnih verskih skupin ter jih nagovoril v njihovem jeziku. V bližini teh krajev naj bi ustvaril tudi zdravilne izvire. Navaja še srečanje z okoli 200 svetovnimi voditelji ali njihovimi predstavniki v Londonu 21. in 22. aprila 1990.",
        "Na srečanjih verskih skupin naj bi ga večina udeležencev prepoznala kot pričakovanega učitelja. Zdravilne vode v Mehiki, Nemčiji in Indiji naj bi privabile milijone obiskovalcev. Na londonski konferenci leta 1990 so bili prisotni predstavniki vlad, gospodarstva, znanosti, religij in novinarstva. Mnogi naj bi obljubili sodelovanje pri uresničevanju njegovih prednostnih nalog.",
      ],
      [
        "Znamenja in čudeži",
        "Share International objavlja poročila o nenavadnih pojavih, med njimi o jokajočih kipih, svetlobnih križih, zdravilnih izvirih in svetlobnih vzorcih. Te pojave razume kot znamenja Maitrejeve navzočnosti in pripravo na njegov javni prihod. Med opisanimi pojavi je tudi svetel objekt, podoben zvezdi, ki naj bi bil viden podnevi in ponoči.",
        "Junija 1988 je Maitrejev sodelavec napovedal, da bo znamenj njegove navzočnosti vse več. Med pojavi, ki jih Share International posebej omenja, so tudi krvaveči kipi Marije in Jezusa, sporočila v sadju in zelenjavi ter bronasti in kamniti sveti kipi, ki naj bi pili mleko. Organizacija te dogodke razume kot krepitev vere, upanja in pričakovanja prihodnosti.",
      ],
      [
        "Maitrejeve napovedi",
        "Med letoma 1988 in 1993 je Maitrejev sodelavec redno obveščal dva londonska novinarja ter jima posredoval njegove nauke in napovedi svetovnih dogodkov. Informacije so bile na voljo svetovnemu tisku in objavljene v reviji Share International. Po navedbah revije so nekatere napovedi dogodkom predhodile za tedne, mesece ali leta.",
        "Med primeri Share International navaja osvoboditev Nelsona Mandele in popuščanje napetosti v Južni Afriki. Navaja tudi izjavo, da bodo morale vlade popustiti glasu ljudstva, ki jo povezuje z dogodki v Vzhodni Evropi in razpadom Sovjetske zveze.",
        "Po navedbah revije je Maitreja junija 1988 napovedal, da se bo svetovni borzni zlom začel na Japonskem. Share International poroča o 40-odstotnem padcu japonskega trga leta 1989 ter poznejših krizah v Vzhodni Evropi, azijskih gospodarstvih, Rusiji in Argentini. Omenja tudi finančni zlom v ZDA leta 2008 in njegove svetovne posledice. To je zgodovinski prikaz navedb Share International, ne posodobljen gospodarski pregled.",
        "Glavni namen teh napovedi je bil osvetliti zakon vzroka in posledice, imenovan tudi zakon karme. Po teh naukih lahko z njegovim razumevanjem in upoštevanjem rešujemo družbene, politične, gospodarske in okoljske krize.",
      ],
      [
        "Maitrejeva sporočila",
        "Med septembrom 1977 in junijem 1982 je britanski pisec in predavatelj Benjamin Creme prejel 140 Maitrejevih sporočil. Posredovana so bila med njegovimi javnimi predavanji v Londonu s postopkom mentalnega presvetljevanja oziroma duhovne telepatije. Creme je ta proces razlikoval od medijstva ali kanaliziranja.",
        "V teh sporočilih Maitreja predlaga ukrepe za nujne gospodarske in družbene spremembe. Človeštvo spodbuja, naj svet obnovi na načelih bratstva, medsebojne delitve in ljubezni. Navaja tudi namige za svoje prepoznavanje in ljudi poziva, naj javnost seznanjajo z njegovo navzočnostjo.",
      ],
      [
        "Maitrejevo javno delovanje",
        "Od januarja 2009 naj bi svetel objekt, podoben zvezdi, po svetu videlo na tisoče ljudi. O njem so poročali v reviji Share International, na spletnih straneh YouTube in v drugih medijih. Benjamin Creme ga je opisal kot napoved Maitrejevega javnega delovanja in navedel, da bo viden do dneva razglasitve.",
        "Na javnem predavanju v Londonu 14. januarja 2010 je Creme povedal, da je Maitreja nedavno dal prvi televizijski intervju na veliki ameriški televizijski mreži. Do konca leta 2010 naj bi opravil več kot dva ducata intervjujev. Predstavljen naj bi bil kot na videz običajen človek, ki predlaga praktične rešitve svetovnih težav ter poziva k pravičnosti in svobodi za vse.",
        "Share International ne objavlja datuma, ure ali televizijske postaje teh intervjujev. Kot razlog navaja, da mora vsakdo imeti možnost odzvati se na Maitrejeve ideje zato, ker si želi delitve dobrin, pravičnosti in miru, ne zato, ker misli, da govori svetovni učitelj.",
      ],
      [
        "Dan razglasitve",
        "Ob najzgodnejšem primernem trenutku naj bi Maitreja razkril svojo resnično identiteto. Ko bo odziv javnosti na njegovo navzočnost in ideje dovolj velik, naj bi ga povabili, da nagovori ves svet. Na dan razglasitve naj bi bil viden na televiziji po povezanih satelitskih omrežjih.",
        "Po tem učenju bo hkrati mentalno presvetlil vse človeštvo. Vsi, starejši od 14 let, naj bi njegove besede notranje, telepatsko slišali v svojem jeziku, tudi če ne bodo gledali televizije. Njegova energija ljubezni naj bi ljudi spodbudila k reševanju sveta, hkrati pa naj bi se zgodile stotisoče spontanih ozdravitev. Organizacija ta pričakovani dogodek opisuje kot način prepoznanja svetovnega učitelja.",
        "Maitreja naj bi orisal prihodnje življenje človeštva ter pozval k pravičnosti in medsebojni delitvi kot poti do pravičnosti in miru. Odziv človeštva naj bi določil prihodnost sveta. Share International navaja njegovo prepričanje, da se bo človeštvo odločilo pravilno.",
      ],
      [
        "Pojasnilo",
        "Ime Maitreja uporabljajo tudi drugi, katerih razumevanje svetovnega učitelja se lahko razlikuje od predstavitve na tem spletnem mestu. Share International poudarja, da posamezniki, ki se sami javno razglašajo za Maitrejo ali svetovnega učitelja, niso oseba, o kateri govori.",
      ],
    ],
  },
  {
    slug: "o-nas",
    title: "O Share International",
    image: "creme",
    intro:
      "Svetovna mreža prostovoljcev, ki povezuje duhovno razumevanje in praktično prizadevanje za pravičnejši svet.",
    sections: [
      [
        "Naš namen",
        "Share International je nepridobitna in neverska svetovna mreža posameznikov in skupin, v celoti prostovoljcev. Njeno delo povezuje dve veliki smeri sodobne misli: politično in duhovno. Glavni namen je seznanjati javnost z navedbami, da so Maitreja, svetovni učitelj za prihajajočo dobo, in mojstri modrosti že med nami ter postopoma vstopajo v javnost.",
        "Ob tem želi mreža pokazati povezanost političnih, družbenih, gospodarskih in duhovnih sprememb po svetu ter spodbuditi praktično delovanje za pravičnejšo in sočutnejšo ureditev.",
      ],
      [
        "Zakaj medsebojna delitev?",
        "Ime Share International izraža prepričanje, da je treba svetovne vire, hrano, surovine ter znanstveno in tehnološko znanje pravično razdeliti glede na potrebe. Tako je mogoče ustvariti pravičnost, zaupanje in mir.",
        "Prvi korak je zagotoviti osnovne življenjske dobrine kot univerzalno pravico: zadostno in primerno hrano, bivališče, zdravstveno varstvo in izobraževanje. Obnova okolja je prav tako osrednja prednostna naloga.",
        "Delo mreže izhaja tudi iz prepričanja o duhovni razsežnosti življenja in obstoju ljudi, ki so v sebi izrazili božanskost, navzočo v vsakem človeku. Ti starejši bratje naj bi vsem ljudem pomagali doseči isto, ne glede na njihovo vero.",
      ],
      [
        "Revija Share International",
        "Poleg tega spletnega mesta in sorodnih strani v drugih jezikih informacije razširja mesečna revija Share International, ki jo berejo v več kot 70 državah. Ob informacijah o Maitrejevem prihodu objavlja prispevke o miru, obnovi okolja, delitvi svetovnih virov in zagotavljanju osnovnih potreb vsem ljudem.",
      ],
      [
        "Benjamin Creme (1922–2016)",
        "Britanski umetnik in dolgoletni raziskovalec ezoterične filozofije Benjamin Creme je postal glavni vir informacij o prihodu Maitreje, svetovnega učitelja. Več kot 40 let je pripravljal pot njegovemu prihodu. Napisal je številne knjige, prevedene v različne jezike, in bil ustanovni urednik revije Share International.",
        "Rodil se je v Glasgowu na Škotskem. Zgodaj se je posvetil umetnosti in postal uveljavljen modernistični slikar. Prijateljeval in sodeloval je s številnimi pomembnimi osebnostmi britanske umetnosti, glasbe in književnosti. Njegova dela so razstavljali v uglednih galerijah.",
      ],
      [
        "Priprava na delo",
        "Creme je preučeval zlasti nauke Helene Blavatsky in Teozofskega društva ter Alice A. Bailey. Leta 1959 naj bi z njim stopil v stik eden od mojstrov modrosti in mu povedal, da se bo svetovni učitelj vrnil čez približno 20 let ter da lahko pri tem sodeluje.",
        "Leta 1972 je po lastnih navedbah začel zahtevno usposabljanje pod vodstvom svojega mojstra. Njegova naloga je bila javnosti predstaviti prihod učitelja, ki ga ljudje različnih religij pričakujejo pod različnimi imeni.",
        "Sporočilo iz leta 1959 je bilo zanj po njegovih besedah popolno presenečenje, čeprav je že verjel v obstoj mojstrov kot varuhov božanskega načrta. Stalni telepatski stik z mojstrom je navajal kot vir sprotnih informacij o Maitrejevem prihodu in osebnega prepričanja, s katerim je o njem govoril.",
      ],
      [
        "Predavanja in publikacije",
        "Leta 1974 je predstavil transmisijsko meditacijo kot skupinsko služenje s prenosom duhovnih energij in sredstvo osebnega razvoja. Leta 1977 je objavil, da je Maitreja začel zunanje delovanje v sodobnem svetu.",
        "Predavati je začel leta 1975 v Združenem kraljestvu in nato po Evropi. Leta 1980 je prvič obiskal ZDA. Njegova poznejša potovanja so zajela Evropo, Japonsko, Avstralijo, Novo Zelandijo, Kanado, Mehiko in ZDA. Samo v ZDA je sodeloval v več kot 300 radijskih in televizijskih oddajah.",
        "Leta 1982 je s sodelavci ustanovil revijo Share International. Za to delo ni sprejemal plačila in ni trdil, da ima poseben duhovni položaj. Svojo nalogo je opisoval kot prvi pristop k javnosti in ustvarjanje vzdušja upanja ter pričakovanja.",
        "V ZDA je od zgodnjih osemdesetih let potoval dvakrat letno. Knjige o Maitrejevem prihodu so izhajale po svetu pri skupinah, ki so se odzvale na njegovo sporočilo. Njegova predavanja in knjige so nagovorili milijone ljudi, od katerih so številni pomagali širiti informacije.",
        "Biografija poudarja njegovo pristnost, inteligenco in humor ter navaja podporo znanih radijskih in televizijskih osebnosti. Kanadski voditelj in producent Max Allen je zgodbo o Maitreji označil za pomembno, Crema pa za občudovanja vrednega govorca.",
        "Benjamin Creme je julija 2006 predaval tudi v dvorani Daga Hammarskjölda pri Združenih narodih v New Yorku. Svojo nalogo je povzel kot ustvarjanje ozračja upanja in pričakovanja.",
      ],
    ],
  },
];

// Short introductions below are used only in homepage previews and search results.
// The full articles always render all blocks from their individual translation files.
const previews = {
  maitreja: {
    image: "maitreya",
    intro:
      "Učitelj in vodnik za vse ljudi, ne glede na njihovo poreklo ali prepričanje.",
  },
  "prednostne-naloge": {
    image: "priorities",
    intro:
      "Primerna hrana in čista voda, bivališče za vse, zdravstveno varstvo in izobraževanje ter obnova okolja.",
  },
  nauki: {
    image: "teachings",
    intro: "Medsebojna delitev, pravičnost in umetnost samouresničevanja.",
  },
  "vecna-modrost": {
    image: "wisdom",
    intro:
      "Pogled na razvoj zavesti v človeku in naravi ter na človekovo mesto v vesolju.",
  },
  "mojstri-modrosti": {
    intro:
      "Člani človeške družine, ki so po razvojni poti napredovali pred nami.",
  },
  "transmisijska-meditacija": {
    image: "meditation",
    intro:
      "Skupinska meditacija kot služenje svetu in pot osebnega duhovnega razvoja.",
  },
};

export const pages = [
  ...presentationPages,
  ...questionCategories,
  ...inDepthPages.map((page) => ({
    ...previews[page.slug],
    ...page,
    searchText:
      page.slug === "maitrejeva-sporocila"
        ? messages
            .map((message) =>
              [message.title, message.date, ...message.paragraphs].join("\n"),
            )
            .join("\n\n")
        : undefined,
    intro:
      previews[page.slug]?.intro ||
      page.blocks.find((block) => block.type === "p")?.text ||
      page.title,
  })),
];

export const findPage = (slug) => pages.find((page) => page.slug === slug);
