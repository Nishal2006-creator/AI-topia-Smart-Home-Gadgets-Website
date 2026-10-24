import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Package, Users, MessageSquare, BarChart3, Settings, 
  MoreVertical, Search, Bell, Plus, Filter, Download, Trash2, Star,
  Sparkles, Loader2
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { cn, playSound } from '@/src/lib/utils';
import { ThemeCustomization } from '@/src/pages/ThemeCustomization';
import { 
  subscribeToOrders, 
  subscribeToProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  subscribeToFeedback,
  deleteFeedback
} from '@/src/services/db';
import { generateProductImage } from '@/src/services/geminiService';
import { Product } from '@/src/data';
import { useAuth } from '@/src/context/AuthContext';
import { AIRefinement } from '@/src/components/Admin/AIRefinement';

const COLORS = ['#00f2ff', '#7000ff', '#ff00d4', '#00ff88'];

const Overview = ({ orders, products }: { orders: any[], products: Product[] }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const chartData = [
    { name: 'Cycle A', revenue: totalRevenue * 0.4 },
    { name: 'Cycle B', revenue: totalRevenue * 0.6 },
    { name: 'Cycle C', revenue: totalRevenue * 0.8 },
    { name: 'Cycle D', revenue: totalRevenue },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Flux', value: `₹${totalRevenue.toLocaleString()}`, change: '+12.5%', color: 'text-primary' },
          { label: 'Neural Links', value: orders.length, change: '+4.2%', color: 'text-secondary' },
          { label: 'Node Hardware', value: products.length, change: '+8.1%', color: 'text-accent' },
          { label: 'System Health', value: '99.9%', change: 'Stable', color: 'text-green-400' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl group hover:border-primary/20 transition-all relative overflow-hidden"
          >
            {/* Neural scan animation */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 pointer-events-none"
            />
            
            <div className="relative z-10">
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">{kpi.label}</div>
              <div className={cn("text-3xl font-display font-bold mb-2", kpi.color)}>{kpi.value}</div>
              <div className="text-xs text-gray-600 font-bold">{kpi.change} vs last cycle</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-xl italic">Revenue Flow</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 glass rounded-lg text-[10px] font-bold text-primary">Live</button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#00f2ff" strokeWidth={3} dot={{ r: 4, fill: '#00f2ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem]">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-xl mb-8 italic">Data Matrix</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Hardware', value: products.length },
                    { name: 'Transactions', value: orders.length },
                    { name: 'Neural Syncs', value: 120 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass p-8 rounded-[2.5rem]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-xl italic">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">
                <th className="pb-4">Link ID</th>
                <th className="pb-4">User</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Flux</th>
                <th className="pb-4">Time</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <AnimatePresence mode="popLayout">
                {orders.map((order, i) => (
                  <motion.tr 
                    key={order.id} 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                  >
                    <td className="py-4 font-mono text-[10px] text-primary">{order.id}</td>
                    <td className="py-4 text-slate-900 dark:text-white font-medium text-xs">{order.userId.slice(0, 8)}...</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-900 dark:text-white font-bold text-xs">₹{order.total.toLocaleString()}</td>
                    <td className="py-4 text-gray-500 text-[10px] font-mono">
                      {order.createdAt?.toDate?.()?.toLocaleTimeString() || "Pending..."}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  product?: Product | null; 
  onSave: (data: Omit<Product, 'id'>) => Promise<void>; 
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || 'Hardware',
    room: product?.room || 'Living Room',
    image: product?.image || '',
    description: product?.description || '',
    features: product?.features || [],
    rating: product?.rating || 5
  });
  const [loading, setLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        room: product.room,
        image: product.image,
        description: product.description,
        features: product.features,
        rating: product.rating
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        category: 'Hardware',
        room: 'Living Room',
        image: '',
        description: '',
        features: [],
        rating: 5
      });
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAIImage = async () => {
    if (!formData.name || !formData.description) {
      alert("Please provide a name and description first for better AI generation.");
      return;
    }

    setIsGeneratingImage(true);
    playSound('click');
    try {
      const imageUrl = await generateProductImage(formData.name, formData.description);
      if (imageUrl) {
        setFormData(prev => ({ ...prev, image: imageUrl }));
        playSound('success');
      } else {
        alert("Neural synthesis failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-10 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors">
          <MoreVertical className="rotate-45" />
        </button>

        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white italic mb-8">
          {product ? 'Decrypt Node Data' : 'Initialize New Hardware'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full glass-dark border-white/10 rounded-2xl px-6 py-3 text-slate-900 dark:text-white text-sm mt-2" 
                  required 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2">Price (₹)</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={e => setFormData(p => ({ ...p, price: Number(e.target.value) }))}
                  className="w-full glass-dark border-white/10 rounded-2xl px-6 py-3 text-slate-900 dark:text-white text-sm mt-2" 
                  required 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="w-full glass-dark border-white/10 rounded-2xl px-6 py-3 text-slate-900 dark:text-white text-sm mt-2"
                >
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Neural">Neural</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2">Room Sync</label>
                <input 
                  type="text" 
                  value={formData.room}
                  onChange={e => setFormData(p => ({ ...p, room: e.target.value }))}
                  className="w-full glass-dark border-white/10 rounded-2xl px-6 py-3 text-white text-sm mt-2" 
                  placeholder="e.g. Living Room"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2">System Rating</label>
                <input 
                  type="number" 
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={e => setFormData(p => ({ ...p, rating: Number(e.target.value) }))}
                  className="w-full glass-dark border-white/10 rounded-2xl px-6 py-3 text-white text-sm mt-2" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2">Node Visuals</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square glass-dark border-dashed border-2 border-white/10 rounded-3xl mt-2 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all group overflow-hidden"
              >
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center">
                    {isGeneratingImage ? (
                      <Loader2 size={24} className="text-primary animate-spin" />
                    ) : (
                      <>
                        <Plus size={24} className="text-gray-500 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">Upload local node</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleGenerateAIImage}
                  disabled={isGeneratingImage || !formData.name}
                  className="flex items-center justify-center gap-2 py-2.5 glass-dark border-primary/20 text-primary hover:bg-primary/10 transition-all rounded-xl text-[10px] uppercase font-bold tracking-widest disabled:opacity-50"
                >
                  {isGeneratingImage ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  {isGeneratingImage ? 'Synthesizing...' : 'Neural Generate'}
                </button>
                <div className="relative group/url">
                  <input 
                    type="url" 
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={e => setFormData(p => ({ ...p, image: e.target.value }))}
                    placeholder="URL Output"
                    className="w-full h-full glass-dark border-white/10 rounded-xl px-4 text-[9px] text-white focus:border-primary/50 outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest pl-2">Description</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full glass-dark border-white/10 rounded-2xl px-6 py-3 text-white text-sm mt-2 resize-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary text-black font-bold uppercase text-[10px] tracking-[0.3em] rounded-2xl glow-primary hover:scale-[1.02] disabled:opacity-50 transition-all mt-4"
          >
            {loading ? 'Processing Node...' : (product ? 'Update Node' : 'Register Hardware')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Inventory = ({ products }: { products: Product[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSave = async (data: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await addProduct(data);
    }
    playSound('success');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Terminate this hardware node session?')) {
      await deleteProduct(id);
      playSound('click');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-white italic">Hardware Catalog</h2>
          <p className="text-gray-500 text-xs">Manage the node repository.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
            playSound('click');
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold uppercase text-[10px] tracking-widest rounded-2xl glow-primary hover:scale-[1.02] transition-all"
        >
          <Plus size={16} />
          Add Hardware
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {products.map((product, i) => (
            <motion.div 
              key={product.id} 
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                setEditingProduct(product);
                setIsModalOpen(true);
                playSound('click');
              }}
              className="glass group overflow-hidden rounded-[2rem] border-white/5 hover:border-primary/20 transition-all cursor-pointer"
            >
              <div className="aspect-square relative">
                <img src={product.image || null} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={(e) => handleDelete(product.id, e)}
                    className="p-2 glass rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-white"
                  >
                    <Filter size={14} className="rotate-45" /> 
                  </button>
                  <div className="p-2 glass rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                    <Settings size={14} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{product.category}</div>
                <h4 className="text-white font-bold text-sm mb-2">{product.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">₹{product.price.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 font-mono italic">{product.room}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={editingProduct}
        onSave={handleSave}
      />
    </div>
  );
};

const FeedbackManagement = ({ feedback }: { feedback: any[] }) => {
  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this feedback?')) {
      await deleteFeedback(id);
      playSound('click');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h2 className="text-2xl font-display font-bold text-white italic">Neural Feedback</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">User experience transmissions</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {feedback.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.05 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-primary/20 transition-all relative group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, starI) => (
                    <Star 
                      key={starI} 
                      size={12} 
                      className={starI < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} 
                    />
                  ))}
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-200 leading-relaxed font-sans mt-2 italic">"{item.message}"</p>
                
                <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {item.userName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-white uppercase tracking-widest truncate">{item.userName}</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">{item.userEmail}</div>
                  </div>
                  <div className="text-[8px] font-mono text-slate-600 uppercase">
                    {item.createdAt?.toDate?.()?.toLocaleDateString() || "Live Path"}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {feedback.length === 0 && (
        <div className="glass p-20 rounded-[3rem] text-center border-dashed border-2 border-white/5">
          <MessageSquare size={48} className="mx-auto text-slate-800 mb-6" />
          <h3 className="text-slate-600 font-bold uppercase tracking-[0.4em]">No Link Feed Identified</h3>
          <p className="text-gray-500 text-[10px] mt-4 uppercase tracking-widest">Awaiting user transmissions from the grid.</p>
        </div>
      )}
    </div>
  );
};

export const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubOrders = subscribeToOrders(setOrders);
    const unsubProducts = subscribeToProducts(setProducts);
    const unsubFeedback = subscribeToFeedback(setFeedback);
    return () => {
      unsubOrders();
      unsubProducts();
      unsubFeedback();
    };
  }, []);

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Overview', path: '/admin' },
    { icon: <Sparkles size={18} />, label: 'Neural Refine', path: '/admin/ai-refine' },
    { icon: <Package size={18} />, label: 'Inventory', path: '/admin/inventory' },
    { icon: <MessageSquare size={18} />, label: 'Feedback', path: '/admin/feedback' },
    { icon: <Settings size={18} />, label: 'Theme', path: '/admin/theme' },
  ];

  return (
    <div className="pt-24 pb-10 px-6 flex h-screen overflow-hidden bg-inherit">
      <div className="max-w-[1600px] mx-auto w-full flex gap-6 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 glass rounded-[2.5rem] flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-10 px-4">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <span className="font-display font-bold text-slate-900 dark:text-white tracking-widest uppercase">Console</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all relative group",
                  location.pathname === item.path ? "bg-primary text-black glow-primary" : "text-gray-500 hover:bg-white/5 hover:text-white"
                )}
                onClick={() => {
                  playSound('click');
                  navigate(item.path);
                }}
              >
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={cn("relative z-10 flex items-center gap-4", location.pathname === item.path && "scale-105")}>
                  {item.icon}
                  {item.label}
                </span>
                {location.pathname === item.path && (
                  <motion.div 
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                  />
                )}
              </button>
            ))}
          </nav>

          <button onClick={() => navigate('/')} className="mt-auto px-4 py-3 glass rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
            Exit Console
          </button>
        </aside>

        {/* Main Console */}
        <main className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Header */}
          <header className="flex justify-between items-center mb-4">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="text" placeholder="Querying node network..." className="w-full glass-dark border-white/5 rounded-2xl pl-12 pr-6 py-3 text-sm italic" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 glass pl-4 pr-2 py-1.5 rounded-2xl border-primary/20">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-white uppercase tracking-tight">{user?.displayName || 'Admin'}</div>
                  <div className="text-[8px] font-mono text-primary uppercase">Root Privilege</div>
                </div>
                <Link to="/profile" className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5 cursor-pointer hover:scale-110 transition-transform">
                  <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=0D0D0D&color=fff` || null} className="w-full h-full rounded-[10px] object-cover" />
                </Link>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route index element={<Overview orders={orders} products={products} />} />
                <Route path="ai-refine" element={<AIRefinement products={products} />} />
                <Route path="inventory" element={<Inventory products={products} />} />
                <Route path="feedback" element={<FeedbackManagement feedback={feedback} />} />
                <Route path="theme" element={<ThemeCustomization />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
