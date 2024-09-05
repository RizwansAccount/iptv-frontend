import { useGetAllEpisodesQuery, useGetAllGenreQuery, useGetAllSeasonsQuery, useGetAllSeriesQuery } from "../redux/storeApis";

export function useGetAllListManager() {
    const { data : allGenres } = useGetAllGenreQuery();
    const { data : allSeries } = useGetAllSeriesQuery();
    const { data : allSeasons } = useGetAllSeasonsQuery();
    const { data : allEpisodes } = useGetAllEpisodesQuery();

    const totalGenres = allGenres?.length;
    const totalSeries = allSeries?.length;
    const totalSeasons = allSeasons?.length;
    const totalEpisodes = allEpisodes?.length;

    return {
        totalGenres,
        totalSeries,
        totalSeasons,
        totalEpisodes
    }
}