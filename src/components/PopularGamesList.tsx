import React, { useState } from 'react';
import { GameItem, GameType } from '../types';
import { POPULAR_GAMES } from '../data/games';
import { sound } from '../utils/audio';
import { Play, ThumbsUp, Users, Sparkles, Flame } from 'lucide-react';

interface PopularGamesListProps {
  searchQuery: string;
  onLaunchGame: (game: GameItem) => void;
  onSelectGameDetails: (game: GameItem) => void;
  onOpenRedeemCode: () => void;
}

export const PopularGamesList: React.FC<PopularGamesListProps> = ({
  searchQuery,
  onLaunchGame,
  onSelectGameDetails,
  onOpenRedeemCode,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'action' | 'simulation' | 'obby'>('all');

  const filteredGames = POPULAR_GAMES.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || g.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const featuredGames = filteredGames.filter((g) => g.featured);
  const standardGames = filteredGames.filter((g) => !g.featured);

  return (
    <div className="space-y-8">
      {/* Interactive Filter Tabs (functional segmented control) */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenRedeemCode();
            }}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all bg-red-600 text-white hover:bg-red-700"
          >
            Redeem Code
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedFilter('all');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Games
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedFilter('action');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              selectedFilter === 'action'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Action &amp; Battle
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedFilter('simulation');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              selectedFilter === 'simulation'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Pet Care &amp; Sim
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedFilter('obby');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              selectedFilter === 'obby'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            666
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          Showing {filteredGames.length} popular games
        </div>
      </div>

      {/* Featured Top Games Section: Fortnite Battle Bus & Animal Hospital */}
      {featuredGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
                Featured Experiences
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Top rated multiplayer hits trending across BloxHub
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredGames.map((game) => (
              <div
                key={game.id}
                className="group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Banner Media */}
                <div 
                  className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => {
                    sound.playClick();
                    onSelectGameDetails(game);
                  }}
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle contrast gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

                  {/* Play CTA Badge over card image */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        onLaunchGame(game);
                      }}
                      className="blox-btn-green px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/30 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      <span>PLAY</span>
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => {
                        sound.playClick();
                        onSelectGameDetails(game);
                      }}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-sky-700 transition-colors cursor-pointer leading-snug"
                    >
                      {game.title}
                    </h3>

                    {/* Clean unboxed metadata with dot separators */}
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold font-mono tabular-nums">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {game.playingCount}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold font-mono tabular-nums">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {game.rating}%
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="truncate">{game.creator}</span>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      {game.tags.slice(0, 3).map((tag, i) => (
                        <span key={tag} className="text-slate-500">
                          {i > 0 && <span className="text-slate-300 mr-2">/</span>}
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onSelectGameDetails(game);
                      }}
                      className="text-sky-600 hover:text-sky-800 font-semibold text-xs transition-colors"
                    >
                      Game Info →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Games Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
            Popular Right Now
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Jump into popular servers with fellow guests worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {standardGames.map((game) => (
            <div
              key={game.id}
              className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Media Thumbnail */}
              <div 
                className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => {
                  sound.playClick();
                  onSelectGameDetails(game);
                }}
              >
                <img
                  src={game.image}
                  alt={game.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-70" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onLaunchGame(game);
                  }}
                  className="absolute bottom-2.5 right-2.5 blox-btn-green px-3 py-1.5 rounded-lg text-white font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white text-white" />
                  <span>PLAY</span>
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => {
                      sound.playClick();
                      onSelectGameDetails(game);
                    }}
                    className="font-bold text-sm text-slate-900 hover:text-sky-700 transition-colors cursor-pointer truncate"
                  >
                    {game.title}
                  </h3>

                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
                    <span className="font-semibold text-slate-700 font-mono tabular-nums">{game.playingCount}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-semibold text-emerald-600 font-mono tabular-nums">{game.rating}%</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="truncate">{game.creator}</span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                    {game.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Server: {game.serverRegion || 'Global'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onSelectGameDetails(game);
                    }}
                    className="text-sky-600 hover:text-sky-800 font-semibold"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
