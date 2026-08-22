import re

with open('src/pages/MediaAndTechPage.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Telegram icon import
content = content.replace("ArrowForward,", "ArrowForward,\n  Telegram,")

# 2. Add Telegram link config in src/config/links.js if needed, or just use a placeholder
TELEGRAM_BOT_URL = "https://t.me/Amde_haymanot_bot" 

# 3. Insert the new block
# We find the end of the first featured project box.
# It ends right before:
#             <Typography
#               sx={{
#                 m: 0,
#                 mt: { xs: 5, md: 6 },
#                 mb: 2.5,
#                 fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
#                 fontWeight: 700,
#                 fontSize: '0.7rem',
#                 letterSpacing: '0.18em',
#                 textTransform: 'uppercase',
#                 color: brand.goldDark,
#               }}
#             >
#               {t.moreLabel}
#             </Typography>

insert_idx = content.find("              {t.moreLabel}")
# find the Typography that encloses it
typography_start = content.rfind("<Typography", 0, insert_idx)

new_block = """
            <Box
              component={motion.article}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewOpts}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
                minHeight: { md: 340 },
                overflow: 'hidden',
                bgcolor: brand.navyInk,
                mt: 4,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  minHeight: { xs: 220, md: 'auto' },
                  background: `
                    radial-gradient(ellipse 70% 60% at 30% 40%, ${alpha(brand.navy, 0.16)} 0%, transparent 55%),
                    linear-gradient(145deg, ${brand.gold} 0%, ${brand.goldDark} 100%)
                  `,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    width: { xs: 100, md: 128 },
                    height: { xs: 100, md: 128 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: brand.white,
                    borderRadius: '50%',
                    border: `2px solid ${brand.navy}`,
                    p: 1.5,
                  }}
                >
                  <Telegram sx={{ fontSize: { xs: 60, md: 80 }, color: brand.navy }} />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: { xs: 3, md: 5 },
                  py: { xs: 4, md: 5 },
                  borderLeft: { md: `3px solid ${brand.navy}` },
                }}
              >
                <Typography
                  sx={{
                    m: 0,
                    mb: 1.5,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: brand.gold,
                  }}
                >
                  {t.telegramBot?.tag || 'Telegram Bot'}
                </Typography>
                <Typography
                  component="h2"
                  sx={{
                    m: 0,
                    mb: 2,
                    fontFamily: '"Cormorant Garamond", "Noto Serif Ethiopic", serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
                    lineHeight: 1.15,
                    color: brand.white,
                  }}
                >
                  {t.telegramBot?.title || 'Student Support Bot'}
                </Typography>
                <Typography
                  sx={{
                    m: 0,
                    mb: 3.5,
                    fontFamily: '"Source Sans 3", "Noto Sans Ethiopic", sans-serif',
                    fontSize: '1.02rem',
                    lineHeight: 1.75,
                    color: alpha(brand.white, 0.78),
                    maxWidth: 420,
                  }}
                >
                  {t.telegramBot?.text || 'Access a wealth of spiritual resources anytime, anywhere. Our dedicated Telegram bot provides Sunday School students with downloadable national curriculum books, supplementary PDF materials, and over 100 interactive practice questions with answers to help deepen your Orthodox faith and prepare for exams.'}
                </Typography>
                <Button
                  component="a"
                  href="https://t.me/Amde_haymanot_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  color="secondary"
                  endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                  sx={{
                    alignSelf: 'flex-start',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 1,
                    px: 3,
                    py: 1.2,
                    boxShadow: 'none',
                  }}
                >
                  {t.openBot || 'Open in Telegram'}
                </Button>
              </Box>
            </Box>
"""

new_content = content[:typography_start] + new_block + "\n" + content[typography_start:]

with open('src/pages/MediaAndTechPage.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated MediaAndTechPage.js")
