/**
 * Cue Foundations · Scrollspy Line Navigation
 * ────────────────────────────────────────────
 * A fixed left-side nav of expanding line indicators that track scroll position and trigger custom eased smooth-scrolling to blog sections.
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/scrollspy-line-navigation.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/cue084
 *
 * Original Cue ID: cue084
 * Category: Navigation
 * ────────────────────────────────────────────
 */

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Line Navigation</title>
    <!-- Premium Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #333333;
            line-height: 1.8;
        }

        /* --- Left Side Line Navigation --- */
        .side-nav {
            position: fixed;
            left: 6vw;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            z-index: 100;
        }

        .nav-line {
            display: flex;
            align-items: center;
            width: 40px; /* Massive hit area for easy clicking */
            height: 24px; /* Massive hit area for easy clicking */
            cursor: pointer;
            text-decoration: none;
            position: relative;
        }

        /* The actual visible line */
        .nav-line::before {
            content: '';
            display: block;
            width: 8px; /* Small inactive visual */
            height: 2px;
            background-color: #e0e0e0;
            border-radius: 2px;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Hover effect */
        .nav-line:hover::before {
            width: 14px;
            background-color: #999;
        }

        /* Active State (The section currently in view) */
        .nav-line.active::before {
            width: 22px; /* Active line size */
            background-color: #111;
        }
        
        /* Optional: Tooltip on hover */
        .nav-line::after {
            content: attr(data-title);
            position: absolute;
            left: 36px;
            top: 50%;
            transform: translateY(-50%) translateX(-10px);
            opacity: 0;
            pointer-events: none;
            font-size: 12px;
            font-weight: 500;
            color: #555;
            white-space: nowrap;
            transition: all 0.3s ease;
        }
        
        .nav-line:hover::after {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
        }

        /* --- Blog Content Layout --- */
        .blog-container {
            max-width: 720px;
            margin: 0 auto;
            padding: 80px 20px 120px 20px;
        }

        /* Blog Header */
        .blog-header {
            margin-bottom: 60px;
        }

        .blog-header img {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 12px;
            margin-bottom: 24px;
        }

        .blog-header .caption {
            font-size: 13px;
            color: #888;
            text-align: center;
            margin-bottom: 40px;
        }

        /* Sections */
        .blog-section {
            padding: 60px 0;
            /* Minimum height to ensure scrolling is required to see the effect */
            min-height: 70vh; 
            scroll-margin-top: 100px; /* Ensures clicking link doesn't stick heading to absolute top */
        }

        .blog-section h2 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #111;
            letter-spacing: -0.5px;
        }

        .blog-section p {
            font-size: 15px;
            color: #333;
            margin-bottom: 22px;
            line-height: 1.85;
            letter-spacing: -0.2px;
            text-align: justify; /* Gives it that blocky blog feel */
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .side-nav {
                left: 2vw;
            }
        }
        
        @media (max-width: 768px) {
            /* Hide line nav on mobile, use a different pattern if needed */
            .side-nav {
                display: none;
            }
        }
    </style>
</head>
<body>

    <!-- Left Line Navigation -->
    <nav class="side-nav">
        <!-- href matches section id, data-title is for tooltip -->
        <a href="#chapter-1" class="nav-line active" data-title="Chapter I"></a>
        <a href="#chapter-2" class="nav-line" data-title="Chapter II"></a>
        <a href="#chapter-3" class="nav-line" data-title="Chapter III"></a>
        <a href="#chapter-4" class="nav-line" data-title="Chapter IV"></a>
        <a href="#chapter-5" class="nav-line" data-title="Chapter V"></a>
    </nav>

    <!-- Main Blog Content -->
    <main class="blog-container">
        
        <header class="blog-header">
            <img src="https://i.pinimg.com/736x/5c/cc/30/5ccc30436d61700ded360abc031f004f.jpg" alt="Novel Header">
            <div class="caption">Down the Rabbit-Hole</div>
        </header>

        <!-- Section 1 -->
        <section class="blog-section" id="chapter-1">
            <h2>Chapter I: Down the Rabbit-Hole</h2>
            <p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?' So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.</p>
            <p>There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!' (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.</p>
            <p>In another moment down went Alice after it, never once considering how in the world she was to get out again. The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well.</p>
            <p>Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled 'ORANGE MARMALADE', but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody, so managed to put it into one of the cupboards as she fell past it.</p>
        </section>

        <!-- Section 2 -->
        <section class="blog-section" id="chapter-2">
            <h2>Chapter II: The Pool of Tears</h2>
            <p>'Curiouser and curiouser!' cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); 'now I'm opening out like the largest telescope that ever was! Good-bye, feet!' (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off). 'Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can; —but I must be kind to them,' thought Alice, 'or perhaps they won't walk the way I want to go! Let me see: I'll give them a new pair of boots every Christmas.'</p>
            <p>And she went on planning to herself how she would manage it. 'They must go by the carrier,' she thought; 'and how funny it'll seem, sending presents to one's own feet! And how odd the directions will look! ALICE'S RIGHT FOOT, ESQ. HEARTHRUG, NEAR THE FENDER, (WITH ALICE'S LOVE). Oh dear, what nonsense I'm talking!'</p>
            <p>Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door. Poor Alice! It was as much as she could do, lying down on one side, to look through into the garden with one eye; but to get through was more hopeless than ever: she sat down and began to cry again.</p>
            <p>'You ought to be ashamed of yourself,' said Alice, 'a great girl like you,' (she might well say this), 'to go on crying in this way! Stop this moment, I tell you!' But she went on all the same, shedding gallons of tears, until there was a large pool all round her, about four inches deep and reaching half down the hall.</p>
        </section>

        <!-- Section 3 -->
        <section class="blog-section" id="chapter-3">
            <h2>Chapter III: A Caucus-Race and a Long Tale</h2>
            <p>They were indeed a queer-looking party that assembled on the bank—the birds with draggled feathers, the animals with their fur clinging close to them, and all dripping wet, cross, and uncomfortable. The first question of course was, how to get dry again: they had a consultation about this, and after a few minutes it seemed quite natural to Alice to find herself talking familiarly with them, as if she had known them all her life. Indeed, she had quite a long argument with the Lory, who at last turned sulky, and would only say, 'I am older than you, and must know better'; and this Alice would not allow without knowing how old it was, and, as the Lory positively refused to tell its age, there was no more to be said.</p>
            <p>At last the Mouse, who seemed to be a person of authority among them, called out, 'Sit down, all of you, and listen to me! I'll soon make you dry enough!' They all sat down at once, in a large ring, with the Mouse in the middle. Alice kept her eyes anxiously fixed on it, for she felt sure she would catch a bad cold if she did not get dry very soon.</p>
            <p>'Ahem!' said the Mouse with an important air, 'are you all ready? This is the driest thing I know. Silence all round, if you please! "William the Conqueror, whose cause was favoured by the pope, was soon submitted to by the English, who wanted leaders, and had been of late much accustomed to usurpation and conquest. Edwin and Morcar, the earls of Mercia and Northumbria—"'</p>
            <p>'Ugh!' said the Lory, with a shiver. 'I beg your pardon!' said the Mouse, frowning, but very politely: 'Did you speak?' 'Not I!' said the Lory hastily. 'I thought you did,' said the Mouse. '—I proceed. "Edwin and Morcar, the earls of Mercia and Northumbria, declared for him: and even Stigand, the patriotic archbishop of Canterbury, found it advisable—"'</p>
        </section>

        <!-- Section 4 -->
        <section class="blog-section" id="chapter-4">
            <h2>Chapter IV: The Rabbit Sends in a Little Bill</h2>
            <p>It was the White Rabbit, trotting slowly back again, and looking anxiously about as it went, as if it had lost something; and she heard it muttering to itself 'The Duchess! The Duchess! Oh my dear paws! Oh my fur and whiskers! She'll get me executed, as sure as ferrets are ferrets! Where CAN I have dropped them, I wonder?' Alice guessed in a moment that it was looking for the fan and the pair of white kid gloves, and she very good-naturedly began hunting about for them, but they were nowhere to be seen—everything seemed to have changed since her swim in the pool, and the great hall, with the glass table and the little door, had vanished completely.</p>
            <p>Very soon the Rabbit noticed Alice, as she went hunting about, and called out to her in an angry tone, 'Why, Mary Ann, what ARE you doing out here? Run home this moment, and fetch me a pair of gloves and a fan! Quick, now!' And Alice was so much frightened that she ran off at once in the direction it pointed to, without trying to explain the mistake it had made.</p>
            <p>'He took me for his housemaid,' she said to herself as she ran. 'How surprised he'll be when he finds out who I am! But I'd better take him his fan and gloves—that is, if I can find them.' As she said this, she came upon a neat little house, on the door of which was a bright brass plate with the name 'W. RABBIT' engraved upon it. She went in without knocking, and hurried upstairs, in great fear lest she should meet the real Mary Ann, and be turned out of the house before she had found the fan and gloves.</p>
            <p>'How queer it seems,' Alice said to herself, 'to be going messages for a rabbit! I suppose Dinah'll be sending me on messages next!' And she began fancying the sort of thing that would happen: '"Miss Alice! Come here directly, and get ready for your walk!" "Coming in a minute, nurse! But I've got to watch this mouse-hole till Dinah comes back, and see that the mouse doesn't get out." Only I don't think,' Alice went on, 'that they'd let Dinah stop in the house if it began ordering people about like that!'</p>
        </section>

        <!-- Section 5 -->
        <section class="blog-section" id="chapter-5">
            <h2>Chapter V: Advice from a Caterpillar</h2>
            <p>The Caterpillar and Alice looked at each other for some time in silence: at last the Caterpillar took the hookah out of its mouth, and addressed her in a languid, sleepy voice. 'Who are YOU?' said the Caterpillar. This was not an encouraging opening for a conversation. Alice replied, rather shyly, 'I—I hardly know, sir, just at present—at least I know who I WAS when I got up this morning, but I think I must have been changed several times since then.'</p>
            <p>'What do you mean by that?' said the Caterpillar sternly. 'Explain yourself!' 'I can't explain MYSELF, I'm afraid, sir' said Alice, 'because I'm not myself, you see.' 'I don't see,' said the Caterpillar. 'I'm afraid I can't put it more clearly,' Alice replied very politely, 'for I can't understand it myself to begin with; and being so many different sizes in a day is very confusing.'</p>
            <p>'It isn't,' said the Caterpillar. 'Well, perhaps you haven't found it so yet,' said Alice; 'but when you have to turn into a chrysalis—you will some day, you know—and then after that into a butterfly, I should think you'll feel it a little queer, won't you?' 'Not a bit,' said the Caterpillar. 'Well, perhaps your feelings may be different,' said Alice; 'all I know is, it would feel very queer to ME.'</p>
            <p>'You!' said the Caterpillar contemptuously. 'Who are YOU?' Which brought them back again to the beginning of the conversation. Alice felt a little irritated at the Caterpillar's making such VERY short remarks, and she drew herself up and said, very gravely, 'I think, you ought to tell me who YOU are, first.' 'Why?' said the Caterpillar. Here was another puzzling question; and as Alice could not think of any good reason, and as the Caterpillar seemed to be in a VERY unpleasant state of mind, she turned away.</p>
            <p>'Come back!' the Caterpillar called after her. 'I've something important to say!' This sounded promising, certainly: Alice turned and came back again. 'Keep your temper,' said the Caterpillar. 'Is that all?' said Alice, swallowing down her anger as well as she could. 'No,' said the Caterpillar.</p>
        </section>

    </main>

    <script>
        // --- Precise Scroll Listener for ScrollSpy ---
        const sections = document.querySelectorAll('.blog-section');
        const navLines = document.querySelectorAll('.nav-line');

        function updateNav() {
            let current = '';
            
            // Detection line is 1/3 down the screen
            const scrollPos = window.scrollY + (window.innerHeight / 3);

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            // Special case: if we are at the absolute bottom of the page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                current = sections[sections.length - 1].getAttribute('id');
            }

            // Update classes
            navLines.forEach(line => {
                line.classList.remove('active');
                if (line.getAttribute('href') === `#${current}`) {
                    line.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateNav);
        
        // Initial call to set correct state on load
        updateNav();

        // --- Custom Cinematic Smooth Scroll Animation ---
        navLines.forEach(line => {
            line.addEventListener('click', function(e) {
                e.preventDefault(); // Stop native jump
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // target position minus the 100px padding we defined earlier
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 100;
                    const startPosition = window.scrollY;
                    const distance = targetPosition - startPosition;
                    
                    const duration = 1000; // 1 second duration for cinematic feel
                    let start = null;
                    
                    // Cinematic Easing Function (easeInOutQuart)
                    function easeInOutQuart(t) {
                        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
                    }

                    function step(timestamp) {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        
                        // Calculate completion percentage (0 to 1)
                        let percentage = Math.min(progress / duration, 1);
                        
                        // Apply easing curve
                        const easing = easeInOutQuart(percentage);
                        
                        window.scrollTo(0, startPosition + (distance * easing));
                        
                        if (progress < duration) {
                            window.requestAnimationFrame(step);
                        } else {
                            // Ensure precise final landing
                            window.scrollTo(0, targetPosition);
                        }
                    }
                    
                    window.requestAnimationFrame(step);
                }
            });
        });
    </script>
</body>
</html>
