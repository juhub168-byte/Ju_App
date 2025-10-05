import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import ClubGrid from '../components/clubs/ClubGrid';
import QueueTable from '../components/clubs/QueueTable';
import ManageClubsTable from '../components/clubs/ManageClubsTable';
import ClubFormModal from '../components/clubs/ClubFormModal';
import DeleteConfirmModal from '../components/clubs/DeleteConfirmModal';
import SearchHeader from '../components/clubs/SearchHeader';
import AppHeader from '../components/UI/AppHeader';
import ClubViewModal from '../components/clubs/ClubViewModal';

const { width } = Dimensions.get('window');

const CLUBS_KEY = 'clubs_list_v1';
const QUEUE_KEY = 'club_queue_v1';

async function load(key, fallback = []) {
  try { const j = await AsyncStorage.getItem(key); return j ? JSON.parse(j) : fallback; }
  catch { return fallback; }
}
async function save(key, value) { try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch {} }

export default function ClubsScreen() {
  const router = useRouter();

  const [clubs, setClubs] = useState([]);
  const [queue, setQueue] = useState([]);

  // shared search
  const [searchQuery, setSearchQuery] = useState('');

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'list',  title: 'List of clubs' },
    { key: 'queue', title: 'Approval Queue' },
    { key: 'manage', title: 'Manage Clubs' },
  ]);

  // create/edit/delete state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingClub, setDeletingClub] = useState(null);

  // view modal state (for blue info button)
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingClub, setViewingClub] = useState(null);

  const seed = useCallback(async () => {
    const cs = await load(CLUBS_KEY);
    const qs = await load(QUEUE_KEY);
    if (cs.length === 0) {
      await save(CLUBS_KEY, [
        { id: 1, name: 'Software Development', leader: 'Mustafa', members: 200, about: 'Build modern websites', image: null },
        { id: 2, name: 'AI', leader: 'Ali', members: 120, about: 'AI & ML projects', image: null },
        { id: 3, name: 'Full stack', leader: 'Ali', members: 200, about: 'React/Node/Postgres', image: null },
        { id: 4, name: 'Multimedia', leader: 'Epyan', members: 78, about: 'Design & Video', image: null },
      ]);
    }
    if (qs.length === 0) {
      await save(QUEUE_KEY, [
        { id: 101, student: 'Dacar', batch: 'B13', request: 'AI' },
        { id: 102, student: 'Abdi',  batch: 'B14', request: 'Software dev' },
        { id: 103, student: 'Ahemd', batch: 'B15', request: 'Full stack' },
        { id: 104, student: 'Abdi',  batch: 'B16', request: 'Multimedia' },
      ]);
    }
  }, []);

  const refresh = useCallback(async () => {
    setClubs(await load(CLUBS_KEY));
    setQueue(await load(QUEUE_KEY));
  }, []);

  useEffect(() => { (async () => { await seed(); await refresh(); })(); }, [seed, refresh]);

  // queue actions (single)
  const approve = async (id) => {
    const q = await load(QUEUE_KEY);
    const picked = q.find(x => x.id === id);
    await save(QUEUE_KEY, q.filter(x => x.id !== id));
    if (picked) {
      const c = await load(CLUBS_KEY);
      const nextId = c.length ? Math.max(...c.map(x => x.id || 0)) + 1 : 1;
      c.push({ id: nextId, name: picked.request, leader: '—', members: 0, about: '', image: null });
      await save(CLUBS_KEY, c);
    }
    await refresh();
  };
  const reject = async (id) => {
    const q = await load(QUEUE_KEY);
    await save(QUEUE_KEY, q.filter(x => x.id !== id));
    await refresh();
  };

  // queue actions (bulk)
  const approveMany = async (ids) => {
    if (!ids || !ids.length) return;
    const q = await load(QUEUE_KEY);
    const picked = q.filter(x => ids.includes(x.id));
    await save(QUEUE_KEY, q.filter(x => !ids.includes(x.id))); // remove selected

    if (picked.length) {
      const c = await load(CLUBS_KEY);
      let nextId = c.length ? Math.max(...c.map(x => x.id || 0)) + 1 : 1;
      picked.forEach(p => {
        c.push({
          id: nextId++,
          name: p.request,
          leader: '—',
          members: 0,
          about: '',
          image: null,
        });
      });
      await save(CLUBS_KEY, c);
    }
    await refresh();
  };

  const rejectMany = async (ids) => {
    if (!ids || !ids.length) return;
    const q = await load(QUEUE_KEY);
    await save(QUEUE_KEY, q.filter(x => !ids.includes(x.id)));
    await refresh();
  };

  // manage actions
  const createClub = async (values) => {
    const c = await load(CLUBS_KEY);
    const nextId = c.length ? Math.max(...c.map(x => x.id || 0)) + 1 : 1;
    c.push({ id: nextId, ...values, members: values.members ? Number(values.members) : 0 });
    await save(CLUBS_KEY, c);
    await refresh();
  };
  const startEdit = (club) => { setEditingClub(club); setEditOpen(true); };
  const saveEdit = async (values) => {
    const c = await load(CLUBS_KEY);
    const next = c.map(x => x.id === editingClub.id ? { ...editingClub, ...values } : x);
    await save(CLUBS_KEY, next);
    setEditOpen(false); setEditingClub(null);
    await refresh();
  };
  const askDelete = (club) => { setDeletingClub(club); setDeleteOpen(true); };
  const doDelete = async () => {
    const c = await load(CLUBS_KEY);
    await save(CLUBS_KEY, c.filter(x => x.id !== deletingClub.id));
    setDeleteOpen(false); setDeletingClub(null);
    await refresh();
  };

  // view handler (for blue info button)
  const onView = (club) => { setViewingClub(club); setViewOpen(true); };

  // filters
  const listFilter = (c) =>
    !searchQuery ||
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.about?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(c.members ?? '').includes(searchQuery);

  const queueFilter = (q) =>
    !searchQuery ||
    q.student?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.batch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.request?.toLowerCase().includes(searchQuery.toLowerCase());
//w
  const manageFilter = listFilter;

  const renderScene = useMemo(() => SceneMap({
    list:   () => <ClubGrid title="List of clubs" clubs={clubs.filter(listFilter)} onView={onView} searchQuery={searchQuery} />,
    queue:  () => (
      <QueueTable
        data={queue.filter(queueFilter)}
        searchQuery={searchQuery}
        onApprove={approve}
        onReject={reject}
        onApproveMany={approveMany}
        onRejectMany={rejectMany}
      />
    ),
    manage: () => (
      <ManageClubsTable
        data={clubs.filter(manageFilter)}
        searchQuery={searchQuery}
        onCreate={() => setCreateOpen(true)}
        onEdit={startEdit}
        onDelete={askDelete}
        onView={onView}   // <<— wire info button here
      />
    ),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [clubs, queue, searchQuery]);

  const searchTitle = ['Clubs', 'Approval Queue', 'Manage Clubs'][index] || 'Clubs';
  const searchPlaceholder = ['Search clubs...', 'Search requests...', 'Search clubs...'][index] || 'Search...';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Reusable app header */}
      <AppHeader
        title="Clubs"
        onBack={() => router.back()}
        onNotificationsPress={() => {}}
        onProfilePress={() => {}}
      />

      {/* search header */}
      <SearchHeader
        value={searchQuery}
        onChange={setSearchQuery}
        title={searchTitle}
        placeholder={searchPlaceholder}
      />

      {/* tabs */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={styles.indicator}
            style={styles.tabbar}
            tabStyle={{ width: 'auto' }}
            renderLabel={({ route, focused }) => (
              <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{route.title}</Text>
            )}
          />
        )}
      />

      {/* modals */}
      <ClubFormModal
        visible={createOpen}
        mode="create"
        initialValues={{ name: '', leader: '', about: '', image: null, members: 0 }}
        onClose={() => setCreateOpen(false)}
        onSubmit={createClub}
      />
      {editingClub && (
        <ClubFormModal
          visible={editOpen}
          mode="edit"
          initialValues={editingClub}
          onClose={() => { setEditOpen(false); setEditingClub(null); }}
          onSubmit={saveEdit}
        />
      )}
      <DeleteConfirmModal
        visible={deleteOpen}
        title="Delete Club"
        message="Are you sure you want to delete this club? This action cannot be undone."
        confirmText="Delete"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={doDelete}
      />

      <ClubViewModal
        visible={viewOpen}
        club={viewingClub}
        onClose={() => { setViewOpen(false); setViewingClub(null); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: { backgroundColor: '#0C8806', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', elevation: 0 },
  indicator: { height: 3, backgroundColor: '#2563EB', borderRadius: 2 },
  tabLabel: { color: '#ffffffff', fontWeight: '600', fontSize: 13, textTransform: 'none', paddingHorizontal: 8 },
  tabLabelActive: { color: '#111827' },
});
