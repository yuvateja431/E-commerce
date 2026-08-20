import React, { useState, useEffect } from "react";
import { getFAQs } from "../../services/cmsService";
import { FiChevronDown, FiSearch, FiHelpCircle, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
export const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState(0);
    useEffect(() => {
        document.title = "Frequently Asked Questions | E-Commerce Store";
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getFAQs("Active");
            setFaqs(data);
        }
        catch (err) {
            setError(err?.response?.data?.message || "Failed to load FAQs. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const filteredFaqs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    return (<div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs border border-indigo-100 shadow-2xs">
            <FiHelpCircle className="w-4 h-4"/>
            <span>Help Center & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Have questions about your order, shipping, or returns? We have compiled the answers to the most common queries below.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search questions or keywords..." className="w-full pl-12 pr-4 py-3.5 text-sm bg-white border border-slate-200 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-800 placeholder-slate-400"/>
        </div>

        {/* Loading State */}
        {loading && (<div className="flex flex-col items-center justify-center py-16 space-y-3">
            <FiLoader className="w-8 h-8 text-indigo-600 animate-spin"/>
            <p className="text-sm font-medium text-slate-500">Loading FAQs...</p>
          </div>)}

        {/* Error State */}
        {error && !loading && (<div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-rose-700">{error}</p>
            <button onClick={fetchData} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition">
              Retry Loading
            </button>
          </div>)}

        {/* Empty State */}
        {!loading && !error && filteredFaqs.length === 0 && (<div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-2xs">
            <FiHelpCircle className="w-12 h-12 text-slate-300 mx-auto"/>
            <h3 className="text-base font-bold text-slate-800">No matching FAQs found</h3>
            <p className="text-sm text-slate-500">
              {searchQuery ? `No questions matched your search "${searchQuery}".` : "There are currently no FAQs published."}
            </p>
          </div>)}

        {/* Accordion FAQ List */}
        {!loading && !error && filteredFaqs.length > 0 && (<div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (<div key={faq.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs transition hover:border-slate-300">
                  <button onClick={() => toggleAccordion(index)} className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none">
                    <span className="text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 bg-indigo-50 text-indigo-600" : ""}`}>
                      <FiChevronDown className="w-5 h-5"/>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </motion.div>)}
                  </AnimatePresence>
                </div>);
            })}
          </div>)}

      </div>
    </div>);
};
