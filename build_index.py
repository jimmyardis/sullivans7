"""Build index.html from version 2's markup (jimmyardis/sullivans3) with the
September 2026 edits: film hero, spine linking into history.html, short
chapter teasers, external CSS/JS, and web-sized photographs."""
import re, pathlib, sys
SRC = pathlib.Path(sys.argv[1])
s = (SRC / 'index.html').read_text()

def swap(old, new, count=1):
    global s
    assert s.count(old) == count, (s.count(old), old[:80])
    s = s.replace(old, new)

def cut(start_marker, end_marker, new):
    """Replace the text from start_marker up to (not including) end_marker."""
    global s
    a = s.index(start_marker); b = s.index(end_marker, a)
    s = s[:a] + new + s[b:]

# ── head: external stylesheet + script ─────────────────────────────
a = s.index('<style>'); b = s.index('</style>') + len('</style>')
s = s[:a] + """<script>document.documentElement.classList.add('js')</script>
<link rel="stylesheet" href="style.css">
<script src="site.js" defer></script>""" + s[b:]
a = s.rindex('<script>'); b = s.rindex('</script>') + len('</script>')
s = s[:a] + s[b:]
swap('<meta name="description" content="One stone. Five faiths. Three centuries. The complete history of Fort Sullivan, Sullivan\'s Island SC — from the 1891 Chapel of the Holy Cross to the Mugdock Keep.">',
     '<meta name="description" content="One stone. Five faiths. Three centuries. Fort Sullivan, Sullivan\'s Island SC — the 1891 Chapel of the Holy Cross joined to the 2010 Mugdock Keep.">')

# ── spine: each year opens its history chapter ─────────────────────
cut('<nav class="spine"', '<!-- ═══', """<nav class="spine" aria-label="Timeline">
    <a class="spine-logo" href="index.html" aria-current="page">Fort Sullivan</a>
    <a href="history.html#chapel" class="spine-link" data-label="1891 · Sacred Beginnings"><span>1891</span></a>
    <div class="spine-divider"></div>
    <a href="history.html#garrison" class="spine-link" data-label="1907 · The Garrison"><span>1907</span></a>
    <div class="spine-divider"></div>
    <a href="history.html#restoration" class="spine-link" data-label="2002 · The Evolution"><span>2002</span></a>
    <div class="spine-divider"></div>
    <a href="history.html#keep" class="spine-link" data-label="2010 · The Modern Bastion"><span>2010</span></a>
    <div class="spine-divider"></div>
    <a href="#archive" class="spine-link" data-label="Museum Archive"><span>Archive</span></a>
</nav>

""")
swap('<body>\n', '<body>\n<a class="skip-link" href="#strata-1">Skip to content</a>\n')

# ── hero: aerial film over the harbor view ─────────────────────────
swap('<div class="hero-bg"></div>', '<div class="hero-bg"></div>\n    <div class="hero-film" aria-hidden="true"></div>')
swap("""        <span>Scroll</span>
    </div>
</header>""", """        <span>Scroll</span>
    </div>
    <button class="film-toggle" type="button" hidden>Pause film</button>
</header>

<nav class="timeline-strip" aria-label="Timeline">
    <a href="history.html#chapel"><b>1891</b><span>Chapel</span></a>
    <a href="history.html#garrison"><b>1907</b><span>Garrison</span></a>
    <a href="history.html#restoration"><b>2002</b><span>Evolution</span></a>
    <a href="history.html#keep"><b>2010</b><span>The Keep</span></a>
</nav>""")

# ── Strata I: one paragraph, then the photographs ─────────────────
cut('<div class="text-body">\n            <p class="text-intro">On the morning', '    </div>\n\n    <!-- Cornerstone', """<div class="text-body">
            <p class="text-intro">On the morning of September 12th, 1891, a cornerstone was set into the soft earth of Sullivan's Island's western end — rubble granite, rough-cut, uncoursed, as honest as any wall on the Carolina coast.</p>
            <a class="chapter-link" href="history.html#chapel">Read the chapter · 1891 <span aria-hidden="true">→</span></a>
        </div>

""")

# ── Interlude ──────────────────────────────────────────────────────
cut('<p>In 1902 the federal government moved to condemn', '</div>\n\n    <div class="filmstrip-track"', """<p>In 1907 the keys changed hands, and for forty years the soldiers of Fort Moultrie married here, prayed here, and returned from war here.</p>
        <a class="chapter-link" href="history.html#garrison">Read the chapter · 1907 <span aria-hidden="true">→</span></a>
    """)

# ── Strata II: the slider stays the centerpiece ───────────────────
cut('<div class="seam-intro">', '    </div>\n\n    <!-- Comparison slider', """<div class="seam-intro">
            <div class="seam-intro-text">
                <p style="font-size:1.1rem;line-height:1.9;color:rgba(255,255,255,0.6);font-family:'Cormorant Garamond',serif;font-style:italic;max-width:480px;">
                    The mandate was unusual: design an addition that looked <em>older</em> than the Gothic church it was joining.
                </p>
                <a class="chapter-link on-join" href="history.html#restoration">Read the chapter · 2002 <span aria-hidden="true">→</span></a>
            </div>
            <div class="seam-intro-right">
                <strong style="color:rgba(255,255,255,0.5);font-family:'Montserrat',sans-serif;font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;">Drag the slider below — peel the centuries apart.</strong>
            </div>
        </div>

""")
cut('    <!-- Seam text -->', '</section>\n\n<!-- ═══', '')

# ── Strata III ─────────────────────────────────────────────────────
cut('<div class="text-body">\n            <p class="text-intro">Completed in 2010.', '    </div>\n\n    <!-- Keep exterior grid', """<div class="text-body">
            <p class="text-intro">Completed in 2010, the Mugdock Keep rises in the Romanesque tradition — rounded arches where the chapel has pointed ones, rooftop terraces reaching toward the Atlantic.</p>
            <a class="chapter-link on-keep" href="history.html#keep">Read the chapter · 2010 <span aria-hidden="true">→</span></a>
        </div>

""")

# ── Closing invitation before the footer ──────────────────────────
swap("""<!-- ═══════════════════════════════════════════════
     FOOTER""", """<section class="closing">
    <h2>A century of becoming.<em>From consecrated granite to living keep.</em></h2>
    <a class="chapter-link" href="history.html">Explore the history <span aria-hidden="true">→</span></a>
</section>

<!-- ═══════════════════════════════════════════════
     FOOTER""")

# ── Viewer: stepping controls ─────────────────────────────────────
swap('<button class="modal-close" id="modal-close" aria-label="Close">✕</button>',
     """<button class="modal-close" id="modal-close" aria-label="Close">✕</button>
    <button class="modal-step modal-prev" id="modal-prev" aria-label="Previous photograph" hidden>←</button>
    <button class="modal-step modal-next" id="modal-next" aria-label="Next photograph" hidden>→</button>
    <span class="modal-count" id="modal-count" aria-live="polite"></span>""")

# ── Photographs: camera originals → web-sized WebP ────────────────
for big in re.findall(r'(Castle-(?:AM|PM)-\d+)\.JPG', s):
    s = s.replace(f'{big}.JPG', f'{big}.webp')
s = s.replace('fireplacezoom.jpg', 'fireplacezoom.webp').replace('castlekeepjoindoor.jpg', 'castlekeepjoindoor.webp')

# The archive's count: keep it honest
n = s.count('class="archive-item"')
s = re.sub(r'The complete visual record · 90\+ images spanning four eras',
           f'The complete visual record · {n} images spanning four eras', s)

pathlib.Path('index.html').write_text(s)
print('index.html', len(s), 'archive items', n)
