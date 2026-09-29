import os

os.makedirs('public/demo/avatars', exist_ok=True)
os.makedirs('public/demo/vehicles', exist_ok=True)
os.makedirs('public/demo/hotspots', exist_ok=True)
os.makedirs('public/demo/docs', exist_ok=True)

# 14 avatars with initials and color
users = [
    ('anitha', 'AR', '#788AFE'),
    ('karthik', 'KS', '#0D9F5E'),
    ('divya', 'DL', '#F5C542'),
    ('arjun', 'AV', '#0D9F5E'),
    ('meenakshi', 'MS', '#F5C542'),
    ('harish', 'HK', '#788AFE'),
    ('priya', 'PD', '#788AFE'),
    ('vignesh', 'VR', '#788AFE'),
    ('nandhini', 'NB', '#788AFE'),
    ('suresh', 'SB', '#7C8099'),
    ('aishwarya', 'AK', '#788AFE'),
    ('irfan', 'MI', '#0D9F5E'),
    ('fathima', 'FB', '#788AFE'),
    ('joseph', 'JA', '#7C8099'),
]

for uname, initials, col in users:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="48" fill="#20222E" stroke="{col}" stroke-width="3"/>
  <text x="48" y="58" font-family="'Sometype Mono', monospace" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">{initials}</text>
</svg>'''
    with open(f'public/demo/avatars/{uname}.svg', 'w', encoding='utf-8') as f:
        f.write(svg)

# 3 vehicles: hatchback, sedan, suv
body_types = [
    ('hatchback', 'HATCHBACK', '#788AFE'),
    ('sedan', 'SEDAN', '#0D9F5E'),
    ('suv', 'SUV', '#F5A524'),
]
for vtype, label, col in body_types:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
  <rect width="200" height="100" rx="16" fill="#20222E" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <path d="M30 65 L45 42 L80 40 L120 40 L150 50 L175 60 L175 72 L30 72 Z" fill="#2A2D3E" stroke="{col}" stroke-width="2"/>
  <circle cx="60" cy="72" r="14" fill="#0A0B1E" stroke="{col}" stroke-width="3"/>
  <circle cx="145" cy="72" r="14" fill="#0A0B1E" stroke="{col}" stroke-width="3"/>
  <text x="100" y="28" font-family="'Sometype Mono', monospace" font-size="11" font-weight="600" fill="#B4B8CC" text-anchor="middle">{label}</text>
</svg>'''
    with open(f'public/demo/vehicles/{vtype}.svg', 'w', encoding='utf-8') as f:
        f.write(svg)

# Hotspot tiles
hotspots = [
    ('guindy_metro', 'Guindy Metro'),
    ('adyar_signal', 'Adyar Signal'),
    ('velachery_bypass', 'Velachery Bypass'),
    ('thiruvanmiyur_mrts', 'Thiruvanmiyur MRTS'),
    ('madhya_kailash', 'Madhya Kailash'),
    ('tidel_park', 'Tidel Park Gate'),
    ('sholinganallur', 'Sholinganallur Signal'),
    ('koyambedu', 'Koyambedu Bus Terminus'),
    ('vadapalani_metro', 'Vadapalani Metro'),
    ('tambaram_station', 'Tambaram Railway Station'),
]
for hid, hname in hotspots:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="12" fill="#20222E" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <circle cx="80" cy="35" r="18" fill="#2A2D3E" stroke="#283AAF" stroke-width="2"/>
  <circle cx="80" cy="35" r="6" fill="#FFFFFF"/>
  <text x="80" y="72" font-family="'Sometype Mono', monospace" font-size="10" font-weight="600" fill="#B4B8CC" text-anchor="middle">{hname[:18]}</text>
</svg>'''
    with open(f'public/demo/hotspots/{hid}.svg', 'w', encoding='utf-8') as f:
        f.write(svg)

# Placeholder docs
for doc in ['govt_id_sample', 'college_id_sample', 'driver_license_sample', 'selfie_sample']:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="240" height="150" viewBox="0 0 240 150">
  <rect width="240" height="150" rx="14" fill="#20222E" stroke="#788AFE" stroke-width="2" stroke-dasharray="4"/>
  <rect x="20" y="20" width="60" height="75" rx="8" fill="#2A2D3E"/>
  <line x1="95" y1="30" x2="210" y2="30" stroke="#B4B8CC" stroke-width="4" stroke-linecap="round"/>
  <line x1="95" y1="50" x2="180" y2="50" stroke="#7C8099" stroke-width="4" stroke-linecap="round"/>
  <line x1="95" y1="70" x2="195" y2="70" stroke="#7C8099" stroke-width="4" stroke-linecap="round"/>
  <text x="120" y="125" font-family="'Sometype Mono', monospace" font-size="11" font-weight="bold" fill="#0D9F5E" text-anchor="middle">VERIFIED OFFICIAL DOCUMENT</text>
</svg>'''
    with open(f'public/demo/docs/{doc}.svg', 'w', encoding='utf-8') as f:
        f.write(svg)

print('Generated demo assets in public/demo/')
