import re

with open('c:/Users/HP/standardshub/src/styles/site.css', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Delete .nav-link.active.nav-ias { ... } up to before .standards-panel .nav-link.active::before
pattern1 = r'\.nav-link\.active\.nav-ias \{.*?(?=\.standards-panel \.nav-link\.active::before \{)'
content = re.sub(pattern1, '', content, flags=re.DOTALL)

# 2. Update .standards-panel .nav-link.active::before
content = content.replace(
    '    background: var(--toc-active, var(--ias));\n}',
    '    background: var(--framework-accent);\n}'
)

# 3. Add focus-visible outline and update mobile padding
# The focus visible rule:
old_focus = """.nav-link:focus-visible {
    background: var(--surface-hover);
    color: var(--text-secondary);
    border: none;
    outline: none;
    box-shadow: none;
}"""
new_focus = """.nav-link:focus-visible {
    background: var(--surface-hover);
    color: var(--text-secondary);
    border: none;
    outline: 2px solid var(--framework-accent);
    outline-offset: -2px;
    box-shadow: none;
}"""
content = content.replace(old_focus, new_focus)

# Mobile padding update inside @media (max-width: 900px)
old_mobile = """.nav-link {
        padding: 6px 14px;
    }"""
new_mobile = """.nav-link {
        padding: 10px 14px;
        min-height: 44px;
    }"""
content = content.replace(old_mobile, new_mobile)

with open('c:/Users/HP/standardshub/src/styles/site.css', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
