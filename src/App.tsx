import React, { useState, useMemo, useEffect } from 'react';
import {
  Wine,
  Clock,
  Sparkles,
  Heart,
  Plus,
  X,
  RefreshCw,
  ChefHat,
  Utensils,
  CheckCircle2,
} from 'lucide-react';
import './App.css';

interface Recipe {
  id: string;
  title: string;
  time: number; // minutes
  drinks: string[];
  ingredients: string[];
  seasonings: string[];
  steps: string[];
  tip: string;
}

const PRESET_INGREDIENTS = [
  '卵',
  '豆腐',
  '納豆',
  'キムチ',
  'チーズ',
  'ちくわ',
  'キャベツ',
  'もやし',
  'きゅうり',
  'トマト',
  '長ねぎ',
  '玉ねぎ',
  'きのこ',
  'なす',
  'ピーマン',
  'じゃがいも',
  '大根',
  'アボカド',
  '豚バラ肉',
  '鶏むね肉',
  'ベーコン',
  'ウインナー',
  'ツナ缶',
  'サバ缶',
  '油揚げ',
];

const DRINK_OPTIONS = ['すべて', 'ビール', 'ハイボール', '日本酒', 'ワイン', '焼酎・サワー'];
const TIME_OPTIONS = [
  { label: 'すべて', value: 999 },
  { label: '5分以内', value: 5 },
  { label: '10分以内', value: 10 },
];

const RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: '無限やみつき塩昆布キャベツ',
    time: 3,
    drinks: ['ビール', 'ハイボール', '焼酎・サワー'],
    ingredients: ['キャベツ'],
    seasonings: ['塩昆布', 'ごま油', 'いりごま', 'にんにくチューブ少々'],
    steps: [
      'キャベツを一口大にちぎり、ポリ袋に入れる。',
      '塩昆布・ごま油・にんにくチューブを加えて袋の上からよく揉み込む。',
      '器に盛り、いりごまを振って完成。',
    ],
    tip: 'キャベツの芯は薄切りにすると食感のアクセントになります。',
  },
  {
    id: 'r2',
    title: 'ちくわの明太マヨチーズ焼き',
    time: 5,
    drinks: ['ビール', 'ハイボール', '日本酒'],
    ingredients: ['ちくわ', 'チーズ'],
    seasonings: ['マヨネーズ', '明太子（または七味唐辛子）', '刻みねぎ'],
    steps: [
      'ちくわを縦半分に切り、アルミホイルの上に並べる。',
      'くぼみにマヨネーズ（あれば明太子）を塗り、ピザ用チーズをのせる。',
      'トースターで3〜4分、チーズに焼き色がつくまで焼く。',
    ],
    tip: '明太子がない場合はマヨネーズ＋醤油数滴＋七味でも絶品です。',
  },
  {
    id: 'r3',
    title: '豚バラもやしのレンジ蒸しポン酢',
    time: 7,
    drinks: ['ビール', 'ハイボール', '焼酎・サワー'],
    ingredients: ['豚バラ肉', 'もやし', '長ねぎ'],
    seasonings: ['ポン酢', 'ごま油', '黒こしょう'],
    steps: [
      '耐熱皿にもやしを広げ、食べやすく切った豚バラ肉を重ならないようにのせる。',
      'ふんわりラップをして600Wの電子レンジで4〜5分加熱する。',
      '水気を軽く切り、小口切りにした長ねぎ・ポン酢・ごま油・黒こしょうをかける。',
    ],
    tip: 'もやしを下に敷くことで豚肉の旨みが全体に行き渡ります。',
  },
  {
    id: 'r4',
    title: 'キムチ納豆の冷奴のせ',
    time: 2,
    drinks: ['ビール', '日本酒', '焼酎・サワー'],
    ingredients: ['豆腐', '納豆', 'キムチ', '長ねぎ'],
    seasonings: ['ごま油', '付属の納豆たれ'],
    steps: [
      '納豆に付属のたれと刻んだキムチ、小口切りの長ねぎを加えて混ぜる。',
      '水気を切った豆腐の上にたっぷりのせる。',
      '仕上げにごま油をひと回しして完成。',
    ],
    tip: '韓国海苔をちぎって散らすとさらに居酒屋感が増します。',
  },
  {
    id: 'r5',
    title: 'ツナと玉ねぎのガリバタ醤油炒め',
    time: 6,
    drinks: ['ビール', 'ハイボール', 'ワイン'],
    ingredients: ['ツナ缶', '玉ねぎ'],
    seasonings: ['バター', '醤油', 'にんにくチューブ', '黒こしょう'],
    steps: [
      '玉ねぎを薄切りにする。',
      'フライパンにバターと油を軽く切ったツナ缶、玉ねぎを入れて中火で炒める。',
      '玉ねぎがしんなりしたらにんにくと醤油を鍋肌から回し入れ、黒こしょうを振る。',
    ],
    tip: 'ツナ缶のオイルを少し残して炒めるとコクがアップします。',
  },
  {
    id: 'r6',
    title: '油揚げのカリカリねぎ味噌チーズピザ',
    time: 6,
    drinks: ['日本酒', 'ビール', 'ハイボール'],
    ingredients: ['油揚げ', 'チーズ', '長ねぎ'],
    seasonings: ['味噌', 'みりん（または砂糖少々）', 'マヨネーズ'],
    steps: [
      '味噌・みりん・マヨネーズを混ぜて油揚げの表面に塗る。',
      '小口切りの長ねぎとチーズをたっぷりのせる。',
      'トースターで4〜5分、油揚げの端がカリッとするまで焼く。',
    ],
    tip: 'キッチンバサミで一口大にカットすると食べやすくなります。',
  },
  {
    id: 'r7',
    title: 'たたききゅうりの梅おかか和え',
    time: 4,
    drinks: ['日本酒', '焼酎・サワー', 'ビール'],
    ingredients: ['きゅうり'],
    seasonings: ['梅干し（または梅チューブ）', 'かつお節', 'ごま油', '醤油少々'],
    steps: [
      'きゅうりをめん棒や包丁の腹で叩いて食べやすく割る。',
      '種を取って叩いた梅干し、かつお節、ごま油、醤油少々で和える。',
    ],
    tip: '叩いて断面をギザギザにすることで味が瞬時に絡みます。',
  },
  {
    id: 'r8',
    title: 'アボカドとトマトのわさび醤油カプレーゼ風',
    time: 4,
    drinks: ['ワイン', '日本酒', 'ビール'],
    ingredients: ['アボカド', 'トマト', 'チーズ'],
    seasonings: ['オリーブオイル', '醤油', 'わさびチューブ'],
    steps: [
      'アボカド、トマト、チーズ（ベビーチーズやスライスでも可）を一口大に切る。',
      'オリーブオイル・醤油・わさびをよく混ぜたドレッシングで和える。',
    ],
    tip: '海苔で巻きながら食べても最高のおつまみになります。',
  },
  {
    id: 'r9',
    title: 'サバ缶と長ねぎの炙り風マヨ七味',
    time: 5,
    drinks: ['日本酒', '焼酎・サワー', 'ハイボール'],
    ingredients: ['サバ缶', '長ねぎ'],
    seasonings: ['マヨネーズ', '醤油', '七味唐辛子'],
    steps: [
      '耐熱皿に汁気を軽く切ったサバ缶をほぐして入れ、斜め薄切りの長ねぎをのせる。',
      'マヨネーズを線描きし、醤油を数滴垂らす。',
      'トースターで焼き目がつくまで4分ほど焼き、七味を振る。',
    ],
    tip: '缶詰の容器のままトースターに入れても洗い物ゼロで作れます。',
  },
  {
    id: 'r10',
    title: 'ベーコンとじゃがいものガリバタ炒め',
    time: 9,
    drinks: ['ビール', 'ハイボール', 'ワイン'],
    ingredients: ['じゃがいも', 'ベーコン'],
    seasonings: ['バター', 'にんにくチューブ', '塩・黒こしょう'],
    steps: [
      'じゃがいもを細切りまたは薄切りにし、耐熱ボウルに入れてラップをし600Wで3分加熱する。',
      'フライパンで短冊切りのベーコンを炒め、じゃがいもを加えて焼き目をつける。',
      'バター・にんにく・塩こしょうで味を調える。',
    ],
    tip: 'レンジで下茹でしておくことで短時間でホクホクに仕上がります。',
  },
  {
    id: 'r11',
    title: 'とろとろなすの生姜醤油レンジ浸し',
    time: 6,
    drinks: ['日本酒', '焼酎・サワー', 'ビール'],
    ingredients: ['なす'],
    seasonings: ['ごま油', 'めんつゆ（または醤油）', '生姜チューブ', 'かつお節'],
    steps: [
      'なすは縦半分に切って斜めに細かく切り込みを入れ、一口大に切る。',
      '耐熱ボウルに入れてごま油を絡め、ふんわりラップして600Wで3分半加熱する。',
      'めんつゆと生姜を絡め、かつお節をたっぷりかける。',
    ],
    tip: 'ごま油をコーティングしてから加熱するとなすの色が綺麗に保てます。',
  },
  {
    id: 'r12',
    title: 'きのことウインナーのペッパーソテー',
    time: 6,
    drinks: ['ビール', 'ワイン', 'ハイボール'],
    ingredients: ['きのこ', 'ウインナー'],
    seasonings: ['オリーブオイル', 'にんにくチューブ', '塩', '粗挽き黒こしょう'],
    steps: [
      'きのこは石づきを取ってほぐし、ウインナーは斜め半分に切る。',
      'フライパンにオリーブオイルとにんにくを熱し、ウインナーときのこを強めの中火で焼く。',
      '焼き色がついたら塩とたっぷりの粗挽き黒こしょうで仕上げる。',
    ],
    tip: 'きのこはあまり触らず焼き目をつけると香ばしさが引き立ちます。',
  },
  {
    id: 'r13',
    title: 'ピーマンとツナの無限塩こんぶ和え',
    time: 5,
    drinks: ['ビール', 'ハイボール', '焼酎・サワー'],
    ingredients: ['ピーマン', 'ツナ缶'],
    seasonings: ['塩昆布', 'ごま油', '鶏ガラスープの素少々'],
    steps: [
      'ピーマンを細切りにし、耐熱ボウルに入れてラップをし600Wで1分半加熱する。',
      '油を切ったツナ缶・塩昆布・ごま油・鶏ガラスープの素を加えてよく和える。',
    ],
    tip: 'ピーマンの苦味が和らぎ、驚くほどペロリと食べられます。',
  },
  {
    id: 'r14',
    title: 'ふわとろニラ玉風・長ねぎあんかけ',
    time: 6,
    drinks: ['ビール', 'ハイボール', '焼酎・サワー'],
    ingredients: ['卵', '長ねぎ'],
    seasonings: ['鶏ガラスープの素', '醤油', 'ごま油', '片栗粉少々'],
    steps: [
      '卵を溶きほぐし、ごま油を熱したフライパンで半熟状に焼いて皿に盛る。',
      '同じフライパンに刻んだ長ねぎ・水100ml・鶏ガラ・醤油・水溶き片栗粉を入れてとろみをつける。',
      '卵の上に熱々のあんをかける。',
    ],
    tip: '卵は半熟のうちに火を止めるとお店のような口当たりになります。',
  },
  {
    id: 'r15',
    title: '大根とツナのシャキシャキ明太マヨサラダ',
    time: 5,
    drinks: ['日本酒', '焼酎・サワー', 'ビール'],
    ingredients: ['大根', 'ツナ缶'],
    seasonings: ['マヨネーズ', 'めんつゆ少々', '黒こしょう'],
    steps: [
      '大根を千切りにして塩ひとつまみ（分量外）を振り、3分置いて水気をしっかり絞る。',
      '油を切ったツナ缶・マヨネーズ・めんつゆ少々で和え、黒こしょうを振る。',
    ],
    tip: '水気をしっかり絞ることで時間が経っても水っぽくなりません。',
  },
  {
    id: 'r16',
    title: '鶏むね肉のしっとりよだれ鶏風',
    time: 10,
    drinks: ['ビール', 'ハイボール', '焼酎・サワー'],
    ingredients: ['鶏むね肉', '長ねぎ', 'きゅうり'],
    seasonings: ['醤油', '酢', '砂糖', 'ごま油', 'ラー油', 'にんにく・生姜チューブ'],
    steps: [
      '鶏むね肉にフォークで穴を開け、耐熱皿にのせて酒大さじ1（分量外）を振りラップをして600Wで3分半加熱し、そのまま3分蒸らす。',
      '食べやすく削ぎ切りにし、千切りきゅうりの上に並べる。',
      '刻みねぎと調味料を混ぜたピリ辛ダレをたっぷりかける。',
    ],
    tip: '加熱後にラップをしたまま余熱で火を通すと驚くほどしっとりします。',
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'favorites'>('generator');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['卵', 'チーズ']);
  const [customInput, setCustomInput] = useState('');
  const [selectedDrink, setSelectedDrink] = useState('すべて');
  const [maxTime, setMaxTime] = useState<number>(999);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('otsumami_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('otsumami_favs', JSON.stringify(favorites));
    } catch {
      // ignore storage errors
    }
  }, [favorites]);

  const toggleIngredient = (item: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    setCurrentIndex(0);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const items = customInput
      .split(/[、,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) return;

    setSelectedIngredients((prev) => {
      const next = [...prev];
      items.forEach((item) => {
        if (!next.includes(item)) next.push(item);
      });
      return next;
    });
    setCustomInput('');
    setCurrentIndex(0);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Score and filter recipes
  const rankedRecipes = useMemo(() => {
    return RECIPES.filter((recipe) => {
      const timeOk = recipe.time <= maxTime;
      const drinkOk = selectedDrink === 'すべて' || recipe.drinks.includes(selectedDrink);
      return timeOk && drinkOk;
    })
      .map((recipe) => {
        const matched = recipe.ingredients.filter((ing) =>
          selectedIngredients.some(
            (sel) => ing.includes(sel) || sel.includes(ing)
          )
        );
        const matchRatio = matched.length / recipe.ingredients.length;
        return {
          recipe,
          matched,
          score: matched.length * 10 + matchRatio * 5,
        };
      })
      .sort((a, b) => b.score - a.score || a.recipe.time - b.recipe.time);
  }, [selectedIngredients, selectedDrink, maxTime]);

  const currentResult =
    rankedRecipes.length > 0
      ? rankedRecipes[currentIndex % rankedRecipes.length]
      : null;

  const handleGenerate = () => {
    setHasGenerated(true);
    setCurrentIndex(0);
  };

  const handleNextRecipe = () => {
    if (rankedRecipes.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % rankedRecipes.length);
    }
  };

  const favoriteRecipes = RECIPES.filter((r) => favorites.includes(r.id));

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-title-group">
          <div className="header-icon">
            <Wine size={20} />
          </div>
          <div>
            <h1 className="app-title">余り物おつまみジェネレーター</h1>
            <p className="app-subtitle">冷蔵庫の食材から今夜の一品を即提案</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'generator' ? (
          <>
            {/* Ingredient Selection */}
            <section className="section-card">
              <div className="section-header">
                <h2 className="section-title">
                  <Utensils size={16} color="#c86d3b" />
                  冷蔵庫にある食材を選択
                </h2>
                {selectedIngredients.length > 0 && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => setSelectedIngredients([])}
                  >
                    すべて解除
                  </button>
                )}
              </div>

              <form className="custom-input-row" onSubmit={handleAddCustom}>
                <input
                  type="text"
                  className="custom-input"
                  placeholder="自由入力（例：はんぺん、しらす）"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
                <button type="submit" className="add-btn">
                  <Plus size={16} />
                  追加
                </button>
              </form>

              {selectedIngredients.length > 0 && (
                <div className="selected-bar">
                  {selectedIngredients.map((item) => (
                    <span
                      key={item}
                      className="selected-pill"
                      onClick={() => toggleIngredient(item)}
                    >
                      {item}
                      <X size={13} />
                    </span>
                  ))}
                </div>
              )}

              <div className="ingredient-chips">
                {PRESET_INGREDIENTS.map((item) => {
                  const isActive = selectedIngredients.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      className={`chip ${isActive ? 'active' : ''}`}
                      onClick={() => toggleIngredient(item)}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Filters */}
            <section className="section-card">
              <div className="filter-group">
                <div>
                  <span className="filter-label">合わせたいお酒</span>
                  <div className="segmented-row">
                    {DRINK_OPTIONS.map((drink) => (
                      <button
                        key={drink}
                        type="button"
                        className={`filter-pill ${selectedDrink === drink ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedDrink(drink);
                          setCurrentIndex(0);
                        }}
                      >
                        {drink}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="filter-label">調理時間</span>
                  <div className="segmented-row">
                    {TIME_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`filter-pill ${maxTime === opt.value ? 'active' : ''}`}
                        onClick={() => {
                          setMaxTime(opt.value);
                          setCurrentIndex(0);
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Generate Button */}
            <button type="button" className="generate-btn" onClick={handleGenerate}>
              <Sparkles size={20} />
              おつまみを提案する
            </button>

            {/* Result Card */}
            {(hasGenerated || selectedIngredients.length > 0) && currentResult && (
              <section className="result-card" key={currentResult.recipe.id}>
                <div className="result-top">
                  <div>
                    <div className="match-badge">
                      <CheckCircle2 size={13} />
                      {currentResult.matched.length > 0
                        ? `選択食材 ${currentResult.matched.length}個一致`
                        : 'おすすめ定番おつまみ'}
                    </div>
                    <h3 className="recipe-title">{currentResult.recipe.title}</h3>
                  </div>
                  <button
                    type="button"
                    className={`fav-btn ${
                      favorites.includes(currentResult.recipe.id) ? 'saved' : ''
                    }`}
                    onClick={() => toggleFavorite(currentResult.recipe.id)}
                    aria-label="お気に入り保存"
                  >
                    <Heart
                      size={20}
                      fill={
                        favorites.includes(currentResult.recipe.id)
                          ? '#e04f5f'
                          : 'none'
                      }
                    />
                  </button>
                </div>

                <div className="meta-tags">
                  <span className="meta-tag">
                    <Clock size={13} />
                    約{currentResult.recipe.time}分
                  </span>
                  <span className="meta-tag">
                    <Wine size={13} />
                    {currentResult.recipe.drinks.join('・')}
                  </span>
                </div>

                <div className="sub-block">
                  <h4 className="sub-block-title">主な食材</h4>
                  <div className="ing-list">
                    {currentResult.recipe.ingredients.map((ing) => {
                      const isMatched = currentResult.matched.includes(ing);
                      return (
                        <span
                          key={ing}
                          className={`ing-item ${isMatched ? 'matched' : ''}`}
                        >
                          {ing}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="sub-block">
                  <h4 className="sub-block-title">調味料</h4>
                  <div className="ing-list">
                    {currentResult.recipe.seasonings.map((s) => (
                      <span key={s} className="ing-item">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sub-block">
                  <h4 className="sub-block-title">作り方</h4>
                  <ol className="steps-list">
                    {currentResult.recipe.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="tip-box">
                  <strong>ワンポイント：</strong>
                  {currentResult.recipe.tip}
                </div>

                {rankedRecipes.length > 1 && (
                  <button
                    type="button"
                    className="next-btn"
                    onClick={handleNextRecipe}
                  >
                    <RefreshCw size={16} />
                    別の候補を見る（{(currentIndex % rankedRecipes.length) + 1} /{' '}
                    {rankedRecipes.length}件）
                  </button>
                )}
              </section>
            )}

            {rankedRecipes.length === 0 && (
              <div className="empty-state">
                <p>条件に合うレシピが見つかりませんでした。調理時間やお酒の条件を広げてみてください。</p>
              </div>
            )}
          </>
        ) : (
          /* Favorites Tab */
          <>
            {favoriteRecipes.length === 0 ? (
              <div className="empty-state">
                <Heart size={36} color="#ccc2b8" />
                <p>お気に入りに保存されたおつまみはまだありません。</p>
              </div>
            ) : (
              favoriteRecipes.map((recipe) => (
                <section className="result-card" key={recipe.id}>
                  <div className="result-top">
                    <div>
                      <h3 className="recipe-title">{recipe.title}</h3>
                    </div>
                    <button
                      type="button"
                      className="fav-btn saved"
                      onClick={() => toggleFavorite(recipe.id)}
                      aria-label="お気に入り解除"
                    >
                      <Heart size={20} fill="#e04f5f" />
                    </button>
                  </div>

                  <div className="meta-tags">
                    <span className="meta-tag">
                      <Clock size={13} />
                      約{recipe.time}分
                    </span>
                    <span className="meta-tag">
                      <Wine size={13} />
                      {recipe.drinks.join('・')}
                    </span>
                  </div>

                  <div className="sub-block">
                    <h4 className="sub-block-title">食材・調味料</h4>
                    <div className="ing-list">
                      {[...recipe.ingredients, ...recipe.seasonings].map((item) => (
                        <span key={item} className="ing-item">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="sub-block">
                    <h4 className="sub-block-title">作り方</h4>
                    <ol className="steps-list">
                      {recipe.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </section>
              ))
            )}
          </>
        )}
      </main>

      <nav className="bottom-nav">
        <button
          type="button"
          className={`nav-item ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          <ChefHat size={20} />
          <span>おつまみ提案</span>
        </button>
        <button
          type="button"
          className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart size={20} />
          <span>
            お気に入り
            {favorites.length > 0 && (
              <span className="badge-count">{favorites.length}</span>
            )}
          </span>
        </button>
      </nav>
    </div>
  );
}

export default App;