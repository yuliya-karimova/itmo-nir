#!/usr/bin/env python3
"""
Скрипт для визуализации результатов сравнения BDUI и Classic подходов
"""

import matplotlib.pyplot as plt
import numpy as np

# Параметры сравнения
parameters = ['TTM', 'Трафик', 'Производительность', 'Ресурсы', 'Оффлайн', 'Поддержка']
bdui_scores = [5, 3, 4, 4, 5, 5]
classic_scores = [1.5, 5, 5, 5, 5, 3]

# Создаем график
x = np.arange(len(parameters))
width = 0.35

fig, ax = plt.subplots(figsize=(12, 6))
bars1 = ax.bar(x - width/2, bdui_scores, width, label='BDUI', color='#3498db', alpha=0.8)
bars2 = ax.bar(x + width/2, classic_scores, width, label='Classic', color='#95a5a6', alpha=0.8)

# Добавляем значения на столбцы
for bars in [bars1, bars2]:
    for bar in bars:
        height = bar.get_height()
        ax.text(
            bar.get_x() + bar.get_width() / 2.,
            height,
            f'{height:.1f}',
            ha='center',
            va='bottom',
            fontweight='bold'
        )

ax.set_ylabel('Баллы (1-5)', fontsize=12)
ax.set_title('Сравнение BDUI и Classic подходов', fontsize=14, fontweight='bold')
ax.set_xticks(x)
ax.set_xticklabels(parameters, fontsize=11)
ax.legend(fontsize=11)
ax.set_ylim(0, 5.5)
ax.grid(axis='y', alpha=0.3, linestyle='--')

# Добавляем итоговую сумму
total_bdui = sum(bdui_scores)
total_classic = sum(classic_scores)
ax.text(
    0.5, 0.02,
    f'Итого: BDUI {total_bdui:.0f}/30, Classic {total_classic:.1f}/30',
    transform=ax.transAxes,
    ha='center',
    fontsize=10,
    bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5)
)

plt.tight_layout()
plt.savefig('comparison_chart.png', dpi=300, bbox_inches='tight')
print('График сохранен в comparison_chart.png')

# Создаем второй график - сравнение TTM
fig2, ax2 = plt.subplots(figsize=(10, 6))

scenarios = ['S1: Простая\nправка', 'S2: Новая\nстраница', 'S3: Форма', 'S4: A/B тест']
bdui_ttm = [1.0, 1.8, 3.18, 1.68]
classic_ttm = [11.3, 23.8, 28.40, 22.05]

x2 = np.arange(len(scenarios))
bars3 = ax2.bar(x2 - width/2, bdui_ttm, width, label='BDUI', color='#3498db', alpha=0.8)
bars4 = ax2.bar(x2 + width/2, classic_ttm, width, label='Classic', color='#95a5a6', alpha=0.8)

# Добавляем значения
for i, (b1, b2) in enumerate(zip(bars3, bars4)):
    h1 = b1.get_height()
    h2 = b2.get_height()
    ax2.text(b1.get_x() + b1.get_width()/2., h1, f'{h1:.1f}м',
            ha='center', va='bottom', fontsize=9, fontweight='bold')
    ax2.text(b2.get_x() + b2.get_width()/2., h2, f'{h2:.1f}м',
            ha='center', va='bottom', fontsize=9, fontweight='bold')

ax2.set_ylabel('Время (минуты)', fontsize=12)
ax2.set_title('Сравнение TTM (Time to Market) по сценариям', fontsize=14, fontweight='bold')
ax2.set_xticks(x2)
ax2.set_xticklabels(scenarios, fontsize=11)
ax2.legend(fontsize=11)
ax2.grid(axis='y', alpha=0.3, linestyle='--')

plt.tight_layout()
plt.savefig('ttm_comparison.png', dpi=300, bbox_inches='tight')
print('График TTM сохранен в ttm_comparison.png')
