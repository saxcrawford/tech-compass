"""WCAG relative-luminance contrast checks for the named text token pairs.
This is not a computed-style or whole-site accessibility audit.
"""
def luminance(color):
 values=[int(color[i:i+2],16)/255 for i in (0,2,4)]
 values=[c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4 for c in values]
 return sum(c*w for c,w in zip(values,(.2126,.7152,.0722)))
pairs=[('Body','172d3b','f6f3ec'),('Muted text','52636a','f6f3ec'),('Teal links','176b73','f6f3ec'),('Button text','ffffff','176b73'),('Hero copy','b8c5ce','0b1c2c'),('Gold labels','c4a46a','0b1c2c'),('Seafoam links','8bcdbd','102638'),('Card body','b4c4cc','102638'),('Footer utility text','a2afb7','0b1c2c'),('Input placeholder','52636a','ffffff')]
for name,fg,bg in pairs:
 a,b=sorted((luminance(fg),luminance(bg)));ratio=(b+.05)/(a+.05)
 assert ratio>=4.5,(name,ratio)
 print(f'{name}: {ratio:.2f}:1')
print('PASS: 10 text color pairs meet 4.5:1.')
