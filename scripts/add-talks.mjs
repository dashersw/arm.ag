// Writes the talks that were never on the Medium site as Markdown, in the same shape import-medium.mjs produces.
// Run: node scripts/add-talks.mjs   (existing files are left alone, so hand edits survive)
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const S = 'https://slides.com/armaganamcalar/'
const G = 'https://github.com/dashersw/'

// [date, kind, lang, title, event, { video, slides, code, deckTitle }, abstract paragraphs...]
const talks = [
  ['2017-08-06', 'conversation', 'tr', 'Daha İyisini Yaratmak için Savaş', 'Geliştirici Sohbetleri with Doğukan Güven Nomak, Istanbul', { video: 'Snevu609DME' },
    'Doğukan Güven Nomak’ın Geliştirici Sohbetleri serisinde yarım saatlik bir söyleşi: yazılıma nasıl başladığım, unu’da neler yaptığımız, açık kaynak ve öğrenmeye bakışım.'],
  ['2017-11-15', 'workshop', 'en', 'Next Generation Microservices with cote', 'DevOps Pro Moscow', { slides: S + 'devopspro-workshop', code: [G + 'cote'] },
    'A hands-on workshop on what actually defines a microservices architecture and why systems that depend on queues and central brokers fall short of it.',
    'We go through the traits a modern implementation needs (zero-configuration, high redundancy, fault tolerance, self-healing and auto-discovery) and build one with Node.js, Docker and cote.'],
  ['2018-04-11', 'conversation', 'en', 'Hacking the Brain with JavaScript', 'Interview at International JavaScript Conference, London', { video: 'WNplnuJSswA', code: [G + 'brain-bits'] },
    'A short interview recorded at iJS London after my talk [Brain: The ultimate hack](/talks/2018-04-11-brain-the-ultimate-hack/), about building a brain-computer interface with JavaScript and why side projects like this matter.'],
  ['2018-09-20', 'talk', 'en', 'The Human Side of Microservices', 'DevOpsDays Istanbul 2018', { slides: S + 'the-human-side-of-microservices' },
    'Software architecture has always been a reflection of the communication patterns of the teams that build it, as Conway’s law puts it. Microservices is an architectural shift, and it is much more than a technical problem.',
    'This talk looks at microservices from the perspective of team psychology and communication: an architecture can only be as solid as the conversations behind it.'],
  ['2020-04-07', 'talk', 'en', 'Five Rules of Microservices', 'I T.A.K.E. Unconference, online', { video: 'BRRd3_Cepm4', slides: S + 'five-rules-of-microservices', code: [G + 'cote'] },
    'The concept of microservices has turned into a rebranding of old ideas. The thinking behind it promises a bigger change than what we usually see in practice.',
    'This talk goes over what actually makes a microservices architecture, why distributed systems that rely on queues and similar mechanisms fail to fulfil the promise, and five rules a modern implementation should follow: zero-configuration, high redundancy, fault tolerance, self-healing and auto-discovery.'],
  ['2020-07-27', 'conversation', 'en', 'Voices in Tech: Armagan Amcalar, Founder of Coyotiv', 'Voices in Tech by tech people code', { video: 'L_1rdlU0kh8' },
    'An hour-long conversation recorded shortly after I started Coyotiv, about the path from electronics engineering to software, leading engineering teams, and why I decided to build a school.'],
  ['2020-10-21', 'conversation', 'tr', 'Beyni Hacklemek', 'Metametrik Çarşamba Buluşmaları 10, online', { video: 'UCXtBorVJJE', code: [G + 'brain-bits'] },
    'Metametrik’in Çarşamba Buluşmaları serisinde beyin-bilgisayar arayüzleri üzerine bir konuşma ve uzun bir soru-cevap: beyin sinyalleri nasıl okunur, P300 nedir ve bütün bunlar JavaScript ile nasıl yapılır.'],
  ['2021-01-04', 'conversation', 'tr', 'Almanya’da Yazılımcı Olmak', 'Kariyer Sohbetleri, DSC Karabük Üniversitesi, online', { video: 'jZ7y9RErAU4' },
    'Karabük Üniversitesi Developer Student Club ile Almanya’da yazılımcı olarak çalışmak, yurt dışına geçiş süreci ve kariyer planlaması üzerine bir sohbet.'],
  ['2021-04-30', 'conversation', 'en', 'Building engineering teams, with Alex Bolboaca', 'Think. Design. Work Smart. by Mozaic Works', { video: 'atRkRQbLI5Q' },
    'A long conversation with Alex Bolboaca about building engineering teams and their culture, inclusive hiring, and what music and digital circuits have in common with software.',
    'There is also a five-minute excerpt, [Armagan Amcalar on Hiring for Software Development](https://www.youtube.com/watch?v=cAgDbA9AH60).'],
  ['2021-05-27', 'talk', 'en', 'Clean Cloud', 'I T.A.K.E. Unconference, online', { video: 'aPj1ei_z1Lc', slides: S + 'clean-cloud' },
    'Proven best practices in software engineering are surprisingly few. We had Clean Code and Clean Architecture, and yet most cloud applications are still put together by trial and error.',
    'Clean Cloud is a set of architectural patterns and practices for building cloud applications that stay simple to reason about as they grow.'],
  ['2022-03-31', 'talk', 'en', 'Building and deploying Next.js applications with Docker', 'Docker Community All-Hands #5, online', { video: 'aNh8iShFXto', slides: S + 'docker-nextjs', code: [G + 'docker-nextjs'] },
    'How to use Next.js in Docker for a consistent development and production setup: development images with live reload, and optimized images for production.'],
  ['2022-12-03', 'talk', 'tr', '2002’ymiş gibi yazılım geliştirin', 'GDG DevFest Konya 2022', { slides: S + '2002ymis-gibi' },
    'Yazılım endüstrisi, çözdüğü problemlere kıyasla çok fazla emek harcıyor. Bu konuşmada bugünün araçlarının getirdiği karmaşıklığı sorguluyor, 2002’nin sadeliğinden neler öğrenebileceğimizi ve bunu kendi işlerimde nasıl uyguladığımı anlatıyorum.'],
  ['2023-05-09', 'conversation', 'en', 'The Future of Learning Software Engineering, with Kyle Simpson', 'Coyotiv webinar, online', { video: '6jXkypbecOA' },
    'A webinar with Kyle Simpson, author of You Don’t Know JS, on how people learn software engineering today, what bootcamps and universities get wrong, and what changes now that AI can write code.'],
  ['2023-09-15', 'talk', 'en', 'Code, Play & Rock ’n’ Roll: A WebAudio Experiment', 'code.talks 2023, Hamburg', { video: '6HwdZDZel-Q', slides: S + 'webaudio-codetalks', code: [G + 'pedalboard.js'] },
    'I hit the stage with a guitar, playing memorable tunes on a Fender with a web browser as the amplifier. This talk is about pushing the limits of what a web browser can do, and goes over [pedalboard.js](/projects/pedalboard-js/), an open source JavaScript framework for building real-time guitar effects in the browser.',
    'Demonstrating both code and music, with a little math and signal processing, I paint a picture of how capable the web is as a platform, and show how to jam with people in other cities over WebRTC.'],
  ['2024-04-01', 'talk', 'tr', 'Reactivity in Vanilla JS with Regie: A New State of Play', 'İstanbul JavaScript Topluluğu, online', { video: '8WF_8PzH1oY', slides: S + 'reactivity-in-vanilla-js-regie', code: [G + 'regie', G + 'regie-demo'] },
    'Framework kullanmadan reaktif uygulamalar nasıl geliştirilir? Bu konuşmada, vanilla JavaScript için Proxy tabanlı küçük bir state yönetim kütüphanesi olan Regie’yi, gerçek örnekler ve arkasındaki mekanizmayla birlikte anlatıyorum.',
    'Regie’deki fikirler daha sonra [Gea](/projects/gea/)’nın reaktivite modelinin temelini oluşturdu.'],
  ['2024-05-10', 'conversation', 'en', 'Secrets of Success: Insights from a Fractional CTO', 'Mastering Tech Growth with Mike Sirius', { video: 'PufZbYfxCSw' },
    'A conversation with Mike Sirius about what a fractional CTO actually does, leading engineering teams remotely, and where AI really improves a team’s productivity.'],
  ['2024-05-23', 'talk', 'en', 'Rethinking Colors in Design Systems: A CSS Approach to Idiomatic Design', 'DevDays Europe 2024, Vilnius', { video: 'Yqt8HHkCEEo', slides: S + 'rethinking-color' },
    'Design systems tend to ship confusing colour names and palettes with hundreds of shades, and developers pay for it every day.',
    'This talk argues for a CSS-first, idiomatic approach that limits the options on purpose, so designers and developers can stop negotiating hex codes and focus on the product.'],
  ['2024-07-13', 'talk', 'en', 'A Path to AGI: Autonomous, Collaborative Multi-Agent Systems', 'Diva: Dive into AI Conference 2024, Istanbul', { slides: S + 'agi' },
    'How independent agents can work together, learn from each other and adapt to complex environments.',
    'Building on how humans learn and how societies evolved, this talk argues that general intelligence is an emergent property of many collaborating minds, and shows what that means for the way we build AI systems.'],
  ['2024-08-06', 'conversation', 'tr', 'CEO & CTO, Coyotiv, Berlin', 'Bilge İnce podcast, S3E3', { video: 'j3jrHIw-ZW4' },
    'Bilge İnce ile bir saatlik bir sohbet: İstanbul’dan Berlin’e uzanan yol, Coyotiv’i kurmak, mühendislik ekipleri yönetmek ve yapay zekânın yazılımcılık mesleğine etkisi.'],
  ['2025-03-30', 'conversation', 'en', 'Innovating Through Curiosity', 'DDDM.FM, episode 14', { video: 'QkrtWOR_uHk' },
    'An episode about building custom AI agents, and about leading startups with data without losing the curiosity that makes the work worth doing.'],
  ['2025-04-22', 'talk', 'en', 'Moving Beyond the Limits of LLMs', 'Dubai AI Week 2025', { slides: S + 'beyond-llms' },
    'To move beyond the limits of large language models, we first need to understand their inner workings. This talk covers the mathematical foundations and the hard limits that follow from them, and then how multi-agent systems and structured reasoning get past those limits.'],
  ['2025-05-03', 'talk', 'tr', 'Önceliğimiz Ne?', 'TEDxBahçeşehir University, Istanbul', { video: '1-O-LLhqUKQ', slides: S + 'seni-durduran-sey-ne-oldu' },
    'Gerçek başarı, geride bıraktığınız etkiyle ölçülür. Burada daha fazla tüketmek için değil, daha fazla üretmek için varız.',
    'Bu konuşmada, yapay zekâ karşısında insan zekâsının anlamını sorguluyor ve geleceği tükettiklerimizin değil ürettiklerimizin şekillendireceğini anlatıyorum.'],
  ['2025-05-05', 'talk', 'en', 'A Path to AGI: Autonomous, Collaborative Multi-Agents', 'Yapay Zeka Zirvesi ’25', { slides: S + 'agi-bilgi' },
    'An updated version of my Diva Conference talk: general intelligence as an emergent property of independent agents that work together, learn from each other and adapt to complex environments.'],
  ['2025-07-26', 'talk', 'en', 'A Path to AGI, vol. 2: Beyond Words and Towards an Architecture of Reliable AI Reasoning', 'Diva: Dive into AI Conference 2025, Istanbul', { slides: S + 'a-path-to-agi-vol-2' },
    'We taught machines to speak; now it is time to teach them to reason. The next leap in AI will come from a better architecture of communication, not from bigger models.',
    'This talk introduces a Process-as-Code approach, where reasoning is expressed as a bounded flowchart the model follows, to build agents that reason predictably. The research behind it was later published as [BRAID](https://arxiv.org/abs/2512.15959).'],
  ['2019-06-17', 'conversation', 'tr', 'Televizyonların renksiz ama hayatların renkli olduğu o günleri özlüyorum', 'Göç Hikayeleri, TDBir', { video: 'buGAyDplTgA' },
    'Göç Hikayeleri programına konuk oldum: İstanbul\'dan Berlin\'e taşınmak, çocukluk, mühendislik ve geride bırakılanlar üzerine bir sohbet.'],
  ['2023-08-28', 'talk', 'en', 'AI-Powered Learning: A Deep Dive into Taiga', 'Coyotiv School of Software Engineering, online', { video: '7KDWyXlXkwY' },
    'With Gonzalo Brandan, I show how we use AI at the Coyotiv School of Software Engineering, and walk through Taiga, the learning platform we built for it.'],
  ['2024-04-11', 'talk', 'en', 'Vuelve Vue 2! A Critical Look at the Composition API in Vue 3', 'International JavaScript Conference', { slides: S + 'vuelve-vue-2', code: [G + 'vuelve', G + 'vuelve-examples'] },
    'CSS, HTML and good JavaScript are declarative. Vue 2 was too, and that is why people loved it. The Composition API in Vue 3 trades that for an imperative style that is harder to read and harder to teach.',
    'This talk compares the two programming models side by side and presents Vuelve, a small library that lets you write Vue 3 composables in the declarative, object-based style of Vue 2.'],
  ['2024-09-20', 'talk', 'en', 'Rethinking Colors in Design Systems: A CSS Approach to Idiomatic Design', 'code.talks 2024, Hamburg', { slides: S + 'colors-ct24', code: [G + 'colors'] },
    'Design systems hand developers a table of numbered shades: blue-100 to blue-900, repeated for every hue. Nobody remembers which number is which, and designers and developers argue about them forever.',
    'This talk treats a shade as a function of a base color and generates the whole palette in CSS, looking at how Ant Design and Bootstrap do it and at what newer color spaces such as OKLCH make possible.'],
  ['2025-01-02', 'talk', 'en', 'Building with the OpenServ Agent Framework', 'OpenServ, online', { video: 'e8MeWDspwL4' },
    'The launch of the OpenServ Agent Framework. I walk through what the framework does and how it is designed, then build the first agent with it live.'],
  ['2025-09-04', 'conversation', 'en', 'Shadow Agents, episode 2', 'OpenServ, online', { video: 'aN5X-2lZVIo' },
    'Why real-world problems need AI that can actually reason, and what we are building at OpenServ to get there.'],
  ['2025-11-05', 'talk', 'en', 'A Path to AGI: Beyond Words and Towards an Architecture of Reliable AI Reasoning', 'code.talks 2025, Hamburg', { slides: S + 'a-path-to-agi-beyond-words' },
    'We taught machines to speak; now it is time to teach them to reason. Modern AI systems often fail to think as carefully as they talk.',
    'This talk replaces ambiguous prompts with Process-as-Code: reasoning written as a bounded flowchart that the model follows. It shows benchmark results where a small, cheap model guided this way matches a far more expensive one. The research was published as [BRAID](https://arxiv.org/abs/2512.15959).'],
  ['2025-11-28', 'talk', 'tr', 'Prompt Nedir, Nasıl Yazılır? Güvenilir Yapay Zeka Mantık Mimarilerine Doğru', 'Canlı yayın, YouTube', { video: 'Mz-I0hiIrI8', slides: S + 'prompt-nedir-nasil-yazilir' },
    'Makinelere konuşmayı öğrettik, şimdi onlara akıl yürütmeyi öğretmenin zamanı. Modern yapay zeka sistemleri çoğu zaman ifade ettikleri incelikte düşünemiyor.',
    'Bu yayında prompt\'un ne olduğunu ve nasıl yazıldığını anlatıyor, ardından akıl yürütmeyi uzun sistem prompt\'ları yerine akış şemalarıyla ifade eden BRAID yaklaşımını ve benchmark sonuçlarını gösteriyorum.'],
  ['2026-02-12', 'talk', 'en', 'The Machine Economy Begins: Welcoming Your AI Overlords', 'Nimble', { video: 'FWYS3bg5Dyk' },
    'What changes when software agents can find each other, negotiate and pay for work on their own, and what kind of infrastructure that economy needs.'],
  ['2026-03-20', 'talk', 'tr', 'Fractional CTO Nedir, Neden İhtiyaç Var?', 'Canlı yayın, YouTube', { video: '25p8pdFaq6g' },
    'Girişimlerin üçte biri üçüncü yılını göremiyor ve yanlış kurulan teknoloji ekipleri ile mimariler bunun önemli sebeplerinden. Fractional CTO\'nun ne yaptığını, kime ne zaman lazım olduğunu anlatıyorum.'],
  ['2026-03-24', 'talk', 'tr', 'Dünyanın En Hızlı JavaScript Framework\'ünü Nasıl Geliştirdim?', 'Canlı yayın, YouTube', { video: 'ripShfX6jAA', code: ['https://github.com/dashersw/gea'] },
    'Framework\'ler neden bu kadar karmaşık olmak zorunda? Değil. Gea\'nın lansman yayını: "sıfır kavram, maksimum performans" fikri nasıl doğdu, Virtual DOM, hook ve signal\'lere neden ihtiyaç kalmadı ve Gea vanilla JS\'e yakın performansa nasıl ulaşıyor.'],
  ['2026-04-07', 'talk', 'tr', 'Yapay Zeka Çağında Yazılım Öğrenmek: Nereden Başlanır, Nasıl Yapılır?', 'Canlı yayın, YouTube', { video: 'GSS7tViFzx8' },
    'Yazılım öğrenmek artık yalnızca kod yazmayı öğrenmek değil; problem çözmeyi, doğru aracı seçmeyi ve makinelerle birlikte düşünmeyi öğrenmek.'],
  ['2026-04-17', 'talk', 'en', 'AI\'s Reasoning/Orchestration Problem', 'Nimble', { video: 'RzXL8kpV89Q' },
    'Models have become fluent, but getting several of them to reason reliably towards one goal is still unsolved. A look at where orchestration breaks down and how bounded reasoning helps.'],
  ['2026-05-29', 'conversation', 'tr', 'Yazılım Öğrenmek Kolay mı Sandın?', 'Canlı yayın, YouTube', { video: 'gifoYzkHbcM' },
    'Coyotiv\'in yazılım eğitimi hakkında sosyal medyadan gelen yorumlara canlı yayında cevap veriyorum.'],
  ['2026-06-24', 'talk', 'tr', 'Yapay Zeka Çağında Deneyimli Yazılımcı Kendini Nasıl Yeniler?', 'Canlı yayın, YouTube', { video: 'jmjnSZUdyDg' },
    'Yirmi yılı aşkın deneyimi olan bir yazılımcı bugün kariyerine yeniden başlasa ne öğrenirdi? Hangi beceriler değer kaybediyor, hangileri daha kritik hale geliyor?'],
  ['2026-08-18', 'talk', 'tr', 'Şirketler için Dönüşüm Rehberi: Ekibinizi AI Çağına Nasıl Hazırlarsınız?', 'Canlı yayın, YouTube', { video: '7IF_zbZIglc' },
    'Herkes ChatGPT kullanıyor ama şirketler yapay zekadan gerçek iş değeri üretmekte zorlanıyor. Ekipleri ve süreçleri buna nasıl hazırlayacağınızı anlatıyorum.'],
  ['2026-08-19', 'talk', 'en', 'Taurus Live Demo: Turn Your Plugins Into a Pedalboard', 'Coyotiv, online', { video: 'CpU4yg9-E9Y' },
    'Taurus is an AudioUnit host for Mac and iPad that turns the plugins you already own into a pedalboard built for playing live. In this demo I build a rig with it and play through it.'],
  ['2026-09-15', 'talk', 'en', 'Meet GEA, the One Stack to Bind Them All', 'Live stream, YouTube', { video: 'Up7uX7bAp-4', code: ['https://github.com/dashersw/gea'] },
    'Gea Stack compiles TypeScript, JSX and real CSS ahead of time into native binaries for microcontrollers, embedded Linux, iOS, Android, iPadOS and macOS. There is no invented language, no interpreter on the device and no per-platform rewrite.',
    'This is the full introduction: how the compiler works, what it targets, and live demos.'],
  ['2026-09-16', 'talk', 'en', 'Introducing SkyTail, and Building Xbox Games with Three.js and Gea Stack', 'Coyotiv', { video: 'ETfSiUHehY4' },
    'SkyTail is the first game we built at Coyotiv. It is written in JavaScript with Three.js and compiled natively for Mac, iPhone, iPad, Windows and Xbox, where it runs at native 4K and 60 frames per second.'],
  ['2026-10-15', 'talk', 'tr', 'Bilimkurguyla Gerçek Riskler Arasında: Yapay Zeka İnsanlığın Sonunu Getirebilir mi?', 'Canlı yayın, YouTube', { video: 'OEQUJtlZzZo' },
    'Yapay zekanın kontrolden çıkabileceği senaryolar ne kadar gerçekçi? AI güvenliği araştırmacıları neden alarm veriyor, bugünkü sistemler neleri yapabiliyor ve tehlikeli sayılan noktaya gelmeleri için neler eksik?'],
  ['2017-07-28', 'talk', 'tr', 'Miyagi’nin Sırrı', 'iKamp 2017, Istanbul', { slides: S + 'miyaginin-sirri-ikamp' },
    'Yazılım ustalığı ve yazılım zanaati eğitimi oldukça meşakkatli bir yolculuktur. Bu konuşmada usta Miyagi’nin öğretme biçiminden örneklerle zanaat eğitiminin zorluklarını anlatıyorum: nitelikli emek, ustalık, el becerisi ve estetik kaygı.'],
  ['2018-05-29', 'talk', 'en', 'Microservices Made Easy with cote.js', 'JSConf.BE 2018, Bruges', { slides: S + 'accessible-microservices-jsconf-be', code: [G + 'cote'] },
    'The concept of microservices is extremely hot. Unfortunately, a lot of ideas from the past get rebranded as microservices.',
    'This talk separates what is and is not a microservice, goes through the traits a modern implementation needs (auto-discovery, zero-configuration, high redundancy, fault tolerance and self-healing) using an example e-commerce app, and builds it in Node.js with cote and Docker.'],
]

const slugify = s =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').replace(/['’]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const card = (href, title, desc) =>
  `<a class="linkcard" href="${href}"><strong>${attr(title)}</strong>${desc ? `<span>${attr(desc)}</span>` : ''}<em>${new URL(href).hostname.replace(/^www\./, '')}</em></a>`

fs.mkdirSync(path.join(root, 'src/assets/talks'), { recursive: true })
let written = 0
for (const [date, kind, lang, title, event, x, ...paras] of talks) {
  const file = path.join(root, 'src/content/talks', `${date}-${slugify(title)}.md`)
  if (fs.existsSync(file)) continue
  let cover
  if (x.video) {
    const img = path.join(root, 'src/assets/talks', `${x.video}.jpg`)
    if (!fs.existsSync(img)) {
      for (const size of ['maxresdefault', 'sddefault', 'hqdefault']) {
        const r = await fetch(`https://i.ytimg.com/vi/${x.video}/${size}.jpg`)
        if (r.ok) {
          fs.writeFileSync(img, Buffer.from(await r.arrayBuffer()))
          break
        }
      }
    }
    if (fs.existsSync(img)) cover = `../../assets/talks/${x.video}.jpg`
  } else if (x.slides?.includes('slides.com')) {
    // No recording: use the deck's own title-slide thumbnail.
    const name = `${date}-${x.slides.split('/').pop()}.jpg`
    const img = path.join(root, 'src/assets/talks', name)
    if (!fs.existsSync(img)) {
      const html = await (await fetch(x.slides)).text()
      const og = html.match(/property="og:image" content="([^"]+)"/)?.[1]
      const r = og && (await fetch(og))
      if (r?.ok) fs.writeFileSync(img, Buffer.from(await r.arrayBuffer()))
    }
    if (fs.existsSync(img)) cover = `../../assets/talks/${name}`
  }
  const front = { title, event, date, lang, kind, cover, video: x.video, slides: x.slides, code: x.code }
  let md =
    '---\n' +
    Object.entries(front).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n') +
    '\n---\n\n' +
    paras.join('\n\n') +
    '\n'
  if (x.slides) md += `\n## Slides\n\n${card(x.slides, `${title} by Armağan Amcalar`, event)}\n`
  if (x.video)
    md += `\n## Video\n\n<div class="embed video"><iframe src="https://www.youtube-nocookie.com/embed/${x.video}" title="${attr(title)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>\n`
  if (x.code) md += `\n## Code\n\n${x.code.map(c => card(c, c.replace('https://github.com/', ''))).join('\n\n')}\n`
  fs.writeFileSync(file, md)
  written++
}
console.log('written', written)
