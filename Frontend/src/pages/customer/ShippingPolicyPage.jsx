import React, { useState, useEffect } from "react";
import { getContentPage } from "../../services/cmsService";
import { FiTruck, FiLoader, FiAlertCircle } from "react-icons/fi";
export const ShippingPolicyPage = () => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        document.title = "Shipping Policy | E-Commerce Store";
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getContentPage("shipping-policy");
            setPage(data);
        }
        catch (err) {
            setError(err?.response?.data?.message || "Failed to load Shipping Policy. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs border border-indigo-100 shadow-2xs">
            <FiTruck className="w-4 h-4"/>
            <span>Store Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {page?.pageTitle || "Shipping Policy"}
          </h1>
          {page?.shortDescription && (<p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {page.shortDescription}
            </p>)}
        </div>

        {/* Loading State */}
        {loading && (<div className="flex flex-col items-center justify-center py-16 space-y-3">
            <FiLoader className="w-8 h-8 text-indigo-600 animate-spin"/>
            <p className="text-sm font-medium text-slate-500">Loading Shipping Policy...</p>
          </div>)}

        {/* Error State */}
        {error && !loading && (<div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
            <FiAlertCircle className="w-10 h-10 text-rose-500 mx-auto"/>
            <p className="text-sm font-semibold text-rose-700">{error}</p>
            <button onClick={fetchData} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition">
              Retry Loading
            </button>
          </div>)}

        {/* Main Content Card */}
        {!loading && !error && page && (<div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-6">
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600" dangerouslySetInnerHTML={{ __html: page.content }}/>
          </div>)}

      </div>
    </div>);
};
