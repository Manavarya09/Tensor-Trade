import { Smartphone, Download, Star } from 'lucide-react';

export default function MobileAppSection() {
  return (
    <section className="py-20 border-t-4 border-black bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 leading-none">
              Trade on <span className="text-orange-600">The Go</span>
            </h2>
            <p className="text-xl font-bold text-gray-600 mb-8 uppercase">
              Access the full power of TensorTrade's multi-agent system from your pocket. Real-time alerts, portfolio management, and instant execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 border-4 border-black hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_#FF5722] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs font-bold uppercase">Download on the</div>
                  <div className="text-xl font-black uppercase">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 border-4 border-black hover:bg-orange-600 hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                <Smartphone className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs font-bold uppercase">Get it on</div>
                  <div className="text-xl font-black uppercase">Google Play</div>
                </div>
              </button>
            </div>
            <div className="mt-8 flex items-center gap-2">
               <div className="flex">
                 {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-orange-600 text-orange-600" />)}
               </div>
               <span className="font-bold uppercase text-sm">4.9/5 Rating based on 10k+ reviews</span>
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-orange-600 translate-x-4 translate-y-4 border-4 border-black"></div>
             <div className="relative border-4 border-black bg-gray-100 p-8 h-[600px] flex items-center justify-center">
                <div className="text-center">
                   <Smartphone className="w-32 h-32 mx-auto mb-4 text-gray-400" />
                   <p className="font-black uppercase text-2xl text-gray-400">App Interface Preview</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
