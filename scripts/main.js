import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/black.css'

import Reveal from 'reveal.js'
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown'
import RevealMath from 'reveal.js/plugin/math/math'

const deck = new Reveal()
deck.initialize({ hash: true, slideNumber: true, plugins: [RevealMarkdown, RevealMath.KaTeX] })
