/* Словари и списки для проверки. Меняйте и дополняйте их здесь. */
(function(){
"use strict";

/* ---------- словари ---------- */
const w = s => new Set(s.split(/\s+/).filter(Boolean));

const FIRST = w(`
james john robert michael william david richard joseph thomas charles daniel matthew anthony mark donald steven paul andrew joshua kenneth kevin brian george edward ronald timothy jason jeffrey ryan jacob gary nicholas eric jonathan stephen larry justin scott brandon benjamin samuel frank gregory raymond alexander patrick jack dennis jerry tyler aaron henry adam douglas nathan peter zachary kyle walter harold carl arthur gerald roger keith jeremy terry lawrence sean christian albert joe ethan austin jesse willie billy bryan bruce jordan ralph roy noah dylan eugene wayne alan juan louis russell gabriel randy philip harry vincent bobby johnny logan
carlos jose luis miguel antonio diego pedro mario marco luca giovanni enzo mateo santiago sebastian
nikita ivan dmitry alexey sergey andrey maxim artem denis oleg viktor pavel vladimir roman egor kirill ilya anton igor yuri nikolai boris
mary patricia jennifer linda elizabeth barbara susan jessica sarah karen nancy lisa betty margaret sandra ashley kimberly emily donna michelle carol amanda melissa deborah stephanie rebecca laura sharon cynthia kathleen amy angela anna emma olivia sophia isabella mia charlotte amelia lily grace chloe maria sofia elena natalia olga
`);

const LAST = w(`
smith johnson williams brown jones garcia miller davis rodriguez martinez hernandez lopez gonzalez wilson anderson thomas taylor moore jackson martin lee perez thompson white harris sanchez clark ramirez lewis robinson walker young allen king wright scott torres nguyen hill flores green adams nelson baker hall rivera campbell mitchell carter roberts gomez phillips evans turner diaz parker cruz edwards collins reyes stewart morris morales murphy cook rogers gutierrez ortiz morgan cooper peterson bailey reed kelly howard ramos kim cox ward richardson watson brooks chavez wood james bennett gray mendoza ruiz hughes price alvarez castillo sanders patel myers long ross foster
ivanov petrov sidorov smirnov kuznetsov popov volkov sokolov lebedev kozlov novikov morozov kovalenko bondarenko shevchenko
rossi russo ferrari esposito bianchi romano colombo ricci marino greco bruno gallo conti santiago fernandez silva costa
`);

const SUFFIXES = /(son|sen|man|ton|ley|ford|well|wood|field|berg|stein|ski|sky|ov|ova|ev|in|enko|ez|es|ini|ino|etti|elli|ucci|ian|yan|ssen|ard|ert|ier|eau|mann|ing|ers)$/i;

const BAD_LONG = ['killer','admin','moder','hacker','cheat','sniper','gangster','mafia','toxic','gamer','player','official','fuck','shit','bitch','nigg','suka','blya','pidor','pidar','zhopa','hitler','stalin','porn','nazi','terror','fagg','whore','cunt','dildo','cocaine','heroin','murder'];
const BAD_EXACT = ['dark','pro','noob','nub','boss','god','king','devil','demon','dead','death','bot','sex','xxx','lox','dick','cock','ass','anal','cum','tits','pussy','owner','vip','yt','tv','ez','fake','test','cool','best','top','wolf','ninja','hero','killa','death','skull','shadow','sniper','lord','queen','master','slayer'];
const KEYBOARD = ['qwer','wert','erty','asdf','sdfg','dfgh','zxcv','xcvb','wasd','abcd','bcde','qaz','wsx','1234','test','aaaa','zzzz','xxxx','hjkl','uiop'];
const CELEBS = w(`
donald_trump vladimir_putin elon_musk michael_jackson barack_obama joe_biden adolf_hitler bill_gates mark_zuckerberg cristiano_ronaldo lionel_messi
tony_stark walter_white jack_sparrow john_cena harry_potter john_wick tommy_vercetti carl_johnson joseph_stalin vladimir_lenin kim_jongun
bruce_wayne peter_parker clark_kent james_bond jason_statham arnold_schwarzenegger keanu_reeves johnny_depp brad_pitt tom_cruise will_smith
steve_jobs jeff_bezos kanye_west justin_bieber taylor_swift donald_duck mickey_mouse darth_vader luke_skywalker
`);

const EXAMPLES = ['John_Miller','Carlos_Santiago','Karatel_One','Anna_McCarthy','xXKillerXx','Dark_Lord','ivan_petrov','Jack_Daniels22','Asdf_Qwerty','Donald_Trump'];

window.RPData = {FIRST, LAST, SUFFIXES, BAD_LONG, BAD_EXACT, KEYBOARD, CELEBS, EXAMPLES};
})();
